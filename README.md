# logger-vue-plugin

## Error logger plugin for Vue

### Purpose

Use this to log activity in a way where you can see it in the console when running dev/local mode, but it is hidden in production.
In production, you can still view activity by running this in your console:

```
logger.view()
```

Or, enable active logging in production:

```
logger.on()
```

### Vue installer

```
Vue.use(Logger, {
    isActive: process.env.NODE_ENV !== "production",
    propertyName: "$logger"
})
```

### Using it in your Vue app

Access using this.\$logger

```
methods: {
    doSomething() {
        // do something
        // ...
        // log it
        this.$logger.log("I just did something");
    }
}
```

### Writing activity to a SharePoint list

If you use SharePoint, combine this logger with sharepoint-vue-plugin to write activity, such as errors, back to a SharePoint list.

Install:

```
Vue.use(Logger, {
    isActive: process.env.NODE_ENV !== "production",
    propertyName: "$logger",
    listName: "ErrorLogs"
})
```

Manual saving:

```
this.$logger.save()
```

Or automatic saving:

```
Vue.use(Logger, {
    isActive: process.env.NODE_ENV !== "production",
    propertyName: "$logger",
    listName: "ErrorLogs",
    saveInterval: 30000
})
```
