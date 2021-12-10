# change-milestone-action
Change an existing milestone. Pure JS action.

The action is written in JavaScript for speed of execution.

## Inputs

### `token`

**Required** GitHub Token.

### `by_id`

Search milestone by ID.

### `by_number`

Search milestone by Number.

### `by_title`

Search milestone by Title.

### `title`

Set the title of a milestone.

### `state`

Set the state of a milestone. Either `open` or `closed`.

### `description`

Set the description of a milestone.

### `due_on`

Set the due date of a milestone. Timestamp in ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`.

## Outputs

### `id`

An ID of the changed milestone.

### `number`

A Number of the changed milestone.

### `state`

A State of the changed milestone.

### `title`

A Title of the changed milestone.

### `description`

A Description of the changed milestone.

### `due_on`

The due date of the changed milestone.

## Example

```yaml
uses: sv-tools/change-milestone-action@v1
with:
  token: ${{ secrets.GITHUB_TOKEN }}
  by_id: "123"
  state: "close"
```
