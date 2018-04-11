export function configure(aurelia) {
    return new Promise((resolve) => {
        aurelia.use
            .standardConfiguration()
            .developmentLogging()
            .globalResources('pragma-menu/pragma-menu')
            .plugin("pragma-views", builder => builder.useAll());

        aurelia.start().then(() => {
            aurelia.setRoot();
            resolve();
        });
    });
}