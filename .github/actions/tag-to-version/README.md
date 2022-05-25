# Extract version from tag action

This action extract the version from tag and provide it to pubspec.

## Usage

To be able to use this action, you must retreive all the history of the repository by using the `fetch-depth` option of the `actions/checkout@v3` as bellow

```yaml
- name: Checkout
  uses: actions/checkout@v3
  with:
    fetch-depth: 0 # Mandatory to use the extract version from tag action

- name: Extract version from tag to pubspec
  uses: ibragimovdp/tag-to-version@v1.0.0
```