import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { ExecOptions } from '@actions/exec/lib/interfaces';
import * as YAML from 'js-yaml'
import * as fs from 'fs'

const MAJOR: string = 'MAJOR';
const MINOR: string = 'MINOR';
const PATCH: string = 'PATCH';
const BUILD_NUMBER: string = 'BUILD_NUMBER';

process.on('unhandledRejection', handleError)
main().catch(handleError)

async function main(): Promise<void> {
    try {

        let tag = await getLastestTag();
        if (tag) {
            formatSemanticValuesFromTag(tag);
        } else {
            core.setFailed(`No valid tag found: ${tag}`)
        }

    } catch (error) {
        core.setFailed(error.message);
    }
}

async function getLastestTag(): Promise<string | undefined> {
    let tag: string | undefined;
    const options: ExecOptions = {
        listeners: {
            stdout: (data: Buffer) => {
                tag = data.toString().trim();
                core.info(tag);
                core.info(`Tag retreived: ${tag}`);
            },
            stderr: (data: Buffer) => {
                core.error(data.toString().trim());
                core.setFailed('No tag found on this branch, please verify you have one in your remote repository and the fetch-depth option set to 0, on the checkout action.');
            }
        }
    };

    await exec.exec('git', ['describe', '--tags', '--abbrev=0'], options);

    return tag;
}

function formatSemanticValuesFromTag(tag: String) {

    if (tag.includes('v')) {
        tag = tag.split('v')[1];
    }

    try {
        // Load the YAML
        const raw = fs.readFileSync("pubspec.yaml");
        const pubspec = YAML.load(raw);

        // Modify the YAML
        pubspec.version = tag

        console.log(__dirname);

        // Saved the YAML
        const yaml = YAML.dump(pubspec);
        fs.writeFileSync("pubspec.yaml", yaml, function (err, file) {
            if (err) throw err;
            console.log("Saved!");
        });
    } catch (error) {
        core.setFailed(error.message);
    }
    
}

function handleError(err: any): void {
    console.error(err)
    core.setFailed(`Unhandled error: ${err}`)
}