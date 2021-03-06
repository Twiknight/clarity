/*
 * Copyright (c) 2016 - 2017 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ClarityModule } from "clarity-angular";

import { RouterModule } from "@angular/router";
import { DocWrapperModule } from "../_doc-wrapper/doc-wrapper.module";
import { UtilsModule } from "../../../utils/utils.module";

import { DesugaredIfOpenDemo } from "./de-sugared-if-open.demo";
import { SignpostDemo } from "./signpost.demo";
import { SignpostFormDemo } from "./signpost-form.demo";
import { SignpostParagraphDemo } from "./signpost-paragraph.demo";
import { SignpostPositionsDemo } from "./signpost-positions.demo";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ClarityModule,
        RouterModule,
        DocWrapperModule,
        UtilsModule
    ],
    declarations: [
        DesugaredIfOpenDemo,
        SignpostDemo,
        SignpostFormDemo,
        SignpostParagraphDemo,
        SignpostPositionsDemo
    ]
})
export class SignpostDemoModule {
}
