/*
  Logger Vue plug-in
  @date 2020-01-22b
*/

/*
    Vue installer

    Vue.use(Logger, {
        isActive: process.env.NODE_ENV !== "production",
        propertyName: "$logger",
        listName: "ErrorLogs"
    })

    Access using this.$logger
*/
export default {
  install(Vue, { propertyName, isConsoleActive, spc, listName, saveInterval }) {
    let logger = new Logger({
      isConsoleActive,
      spc,
      listName,
      saveInterval
    });
    if (!propertyName) propertyName = "$logger";
    Object.defineProperty(Vue.prototype, propertyName, { value: logger });
  }
};

class Logger {
  constructor({ isConsoleActive, spc, listName, saveInterval }) {
    this.isActive = true;
    this.isConsoleActive = isConsoleActive;
    this.spc = spc;
    this.listName = listName;
    this.saveInterval = saveInterval;
    this.messages = [];
    this.errors = [];
    if (this.saveInterval) {
      let me = this;
      this.saveIntervalTimer = setTimeout(() => {
        me.save();
      }, this.saveInterval);
    } else this.saveIntervalTimer = null;
  }

  log(message) {
    this._add(message, this.messages);
  }

  error(summary, details) {
    this._add({ summary, details }, this.errors);
    if (this.isConsoleActive) {
      console.error(summary);
      console.error(details);
    }
    if (this.spc && this.listName) {
      // write to server log
      this.spc
        .addListItem({
          listName: this.listName,
          itemData: {
            Title: summary,
            Details: details
          }
        })
        .catch(error => {
          this._add(
            { summary: "Write error to server", details: error },
            this.errors
          );
        });
    }
  }

  _add(message, list) {
    if (this.isActive && message) {
      list.push(message);
      if (this.isConsoleActive) console.log(message);
    }
  }

  on() {
    this.isConsoleActive = true;
  }

  off() {
    this.isConsoleActive = false;
  }

  save(listName) {
    if (!listName) listName = this.listName;
    if (this.spc && listName) {
      this.isActive = false;
      while (this.messages.length) {
        this.spc.addListItem({
          listName: listName,
          itemData: {
            message: this.messages.shift()
          }
        });
      }
      this.isActive = true;
    }
  }

  view(mostRecentCount) {
    for (
      let m = mostRecentCount
        ? Math.max(0, this.messages.length - mostRecentCount)
        : 0;
      m < this.messages.length;
      m++
    ) {
      console.log(this.messages[m]);
    }
  }

  clear() {
    this.messages.splice(0);
  }

  destroy() {
    this.clear();
    clearTimeout(this.saveIntervalTimer);
  }
}
