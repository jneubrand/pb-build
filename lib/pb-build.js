'use babel';
'use strict';

import fs from 'fs';

export const config = {
    verbose: {
        title: "Verbosity",
        type: "integer",
        default: 0,
        minimum: 0,
        maximum: 4,
        order: 0
    },
    phoneip: {
        title: "Phone IP",
        type: "string",
        default: '[...]',
        order: 1
    }
}

class PbBuilder {
    getNiceName() {
        return "Pebble Build";
    }

    isEligible() {
        // Based on code from: https://github.com/AtomBuild/atom-build-cargo/
        /*
            Copyright (c) 2015 Alexander Olsson

            Permission is hereby granted, free of charge, to any person
            obtaining a copy of this software and associated documentation files
            (the "Software"), to deal in the Software without restriction,
            including without limitation the rights to use, copy, modify, merge,
            publish, distribute, sublicense, and/or sell copies of the Software,
            and to permit persons to whom the Software is furnished to do so,
            subject to the following conditions:

            The above copyright notice and this permission notice shall be
            included in all copies or substantial portions of the Software.

            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
            OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
            NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
            BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
            ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
            CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
            THE SOFTWARE.
        */
        return fs.existsSync(`${this.cwd}/appinfo.json`) || true;
    }

    settings() {
        var verbose = atom.config.get('pb-build.verbose');
        verbose = verbose ? ('-' + new Array(verbose + 1).join('v')) : '';
        var buildCmd = "echo Starting build in `pwd`; pebble build " + verbose
        return [{"name": "Pebble Tool: Build & Install to Aplite",
                    "exec": buildCmd + " && " +
                        "pebble install --emulator aplite " + verbose,
                    "cwd": "{PROJECT_PATH}"},

                {"name": "Pebble Tool: Build & Install to Basalt",
                    "exec": buildCmd + " && " +
                        "pebble install --emulator basalt " + verbose,
                    "cwd": "{PROJECT_PATH}"},

                {"name": "Pebble Tool: Build & Install to Chalk",
                    "exec": buildCmd + " && " +
                        "pebble install --emulator chalk " + verbose,
                    "cwd": "{PROJECT_PATH}"},

                {"name": "Pebble Tool: Build",
                    "exec": buildCmd,
                    "cwd": "{PROJECT_PATH}"},

                {"name": "Pebble Tool: Build & Install via CloudPebble",
                    "exec": buildCmd + " && " +
                        "pebble install --cloudpebble " + verbose,
                    "cwd": "{PROJECT_PATH}"},

                {"name": "Pebble Tool: Build & Install to Phone",
                    "exec": buildCmd + " && " +
                        "pebble install --phone " + verbose +
                        atom.config.get('pb-build.phoneip'),
                    "cwd": "{PROJECT_PATH}"}];
    }
}

export function providingFunction() {
    return PbBuilder;
}
