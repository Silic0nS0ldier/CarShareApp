# CarShareApp

tl;dr, fastest way to get started is install Docker and run `docker-compose up` from this folder. Ignore any links ommitted in the console, and use those in the Docker section. Running this natively is fully supported, but will take more work to get set up (though you also gain the ability to restart a single component compared to compose).

## Docker

- GUI: http://localhost/
- API: http://localhost:8080/
- IMG: http://localhost:8888/
- Adminer: http://localhost:5050/

To get running, just use `docker-compose up`. Dependencies will be automatically installed, and thanks to volume mapping changes will be immediately applied to the running containers. The command can be run from the root project folder and all folders it contains.

To stop use `ctrl + c` in the console previously used. (or use `docker-compose down` if you managed to close the console)

To reset everything, run `docker-compose rm`.

### Troubleshooting

You might see a share request appear on the first run. You will need to authorise this so that the contents of `api`, `gui` and `img` are mapped into the container.

Docker for Windows has recently gained native support for Windows containers. However this is implemented as a mode, and while in the Windows containers mode you won't be able to use Linux containers. Before running `docker-compose up` ensure that Docker is running in Linux containers mode.

## Best Practices

- The database code should only be required at server start as it carries a 10 second "safety delay". This safety delay is required due to improper exception bubbling within the used libraries causing uncatchable exceptions to fatally crash Node.

## Code Style

This code style guide is not exhaustive, and simply exists to advise in circumstances where a particular code style does change semantics, and to ensure styling has some consistences.

- Statements MUST end with a semicolon. This avoids edge cases where the automatic system misinterprets intent.

```js
// The following...
a = b + c
(d + e).print()
// Would get interpreted as if it were
a = b + c(d + e).print();
```

- Imported (`require()`) libraries must be assigned to a `const`. This is simply to stop confusion among the team, and also falls in line with the ES2015 importing functionality.