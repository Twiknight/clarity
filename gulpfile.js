const gulp = require("gulp");
const ghpages = require("gh-pages");
const path = require("path");
const shell = require("gulp-shell");
const watch = require("gulp-watch");
const fs = require('fs')
const rename = require('gulp-rename')
const sequence = require('gulp-sequence')
const xml = require('xml2js');
const _ = require('lodash');
const Observable = require('rxjs').Observable
require('rxjs/add/observable/combineLatest')

gulp.task("deploy", function () {
    ghpages.publish(path.join(__dirname, "dist"), function (err) {
        if (err) {
            console.log(err);
        }
    });
});

gulp.task('watch', function () {
    // Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event
    return watch('src/releases', function () {
        gulp.src('src/releases')
            .pipe(shell([
                "node generate-template.js"
            ]));
    });
});

gulp.task('i18n', sequence('i18n-extract', 'i18n-update-targets'));

gulp.task('i18n-extract', shell.task('./node_modules/.bin/ng xi18n -of i18n/messages.en.xlf'));

gulp.task('i18n-update-targets', function(){
    const orignXlfPath = 'src/i18n/messages.en.xlf';
    const targetLangs = ['cmn-Hans-CN'];
    for(let lang of targetLangs) {
        const path = `src/i18n/messages.${lang}.xlf`;
        if (!fs.existsSync(path)) {
            gulp.src(orignXlfPath)
            .pipe(rename(path))
            .pipe(gulp.dest('.'))
        } else {
            const orignTree$ = Observable.fromPromise(new Promise((resolve, reject)=>{
                fs.readFile(orignXlfPath, function(err, data) {
                    if(err) {
                        reject(err)
                    } else {
                        const parser = new xml.Parser()
                        parser.parseString(data, (err, res) => {
                            if(err) {
                                reject(err)
                            } else {
                                resolve(res)
                            }
                        })
                    }
                })
            }));
            const targetTree$ = Observable.fromPromise(new Promise((resolve, reject)=>{
                fs.readFile(path, function(err, data) {
                    if(err) {
                        reject(err)
                    } else {
                        const parser = new xml.Parser()
                        parser.parseString(data, (err, res) => {
                            if(err) {
                                reject(err)
                            } else {
                                resolve(res)
                            }
                        })
                    }
                })
            }));

            Observable.combineLatest(orignTree$, targetTree$).subscribe(data => {
                const org = data[0]
                const tar = data[1]
                const orgUnits = org['xliff']['file'][0]['body'][0]['trans-unit']
                const tarUnits = tar['xliff']['file'][0]['body'][0]['trans-unit']
                const merged = _.unionBy(orgUnits, tarUnits, (x) => x['$']['id'])

                tar['xliff']['file'][0]['body'][0]['trans-unit'] = merged

                const builder = new xml.Builder()
                const built = builder.buildObject(tar);

                fs.writeFile(path, built)
            })
        }
    }
})