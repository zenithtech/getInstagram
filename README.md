# getInstagram
- Asynchronously fetches Instagram posts from a provided list of Instagram post IDs via XMLHttpRequest
- Requests to instagram are made from the server side and sent back to the client
- Skips invalid posts and timed out requests
- Optinally randomize and renders the resulting data to HTML
- Templating easily customizable

Example: https://zenitht.com/git/getInstagram/

## License

This package is licensed under MIT license. See LICENSE for details.

See index.php for examples.

## Usage

Option 1:
Provide a list of post IDs (no posts limit):
````
window.instalinks = [
    'BA9M58hoTYL',
    'BA-vDsLKowA',
    'xxxxxx', // invalid post ID, will be skipped
    '88qlkdiEfD',
    'BAzlDkePKke'
];

instalinks = shuffle(instalinks); // Optionally shuffle

window.getInstagram(
  "php/instagram.php",
  instalinks,
  document.getElementById('instgramelement'),
  5,
  false
);
````

Option 2: Provide an instagram user ID (maximum 12 posts can be fetched):
```
window.getInstagram(
  "php/instagram.php",
  false,
  document.getElementById('instgramelement'),
  12,
  'facebook'
);
```
