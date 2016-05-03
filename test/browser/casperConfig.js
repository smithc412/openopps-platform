casper.options.waitTimeout = 1000 * 15;
casper.options.viewportSize = {width: 1000, height:1000};
casper.userAgent('Mozilla/5.0');
casper.on('remote.message', function(message) {
  console.log('browser console.log ==> ', message);
});
casper.on('page.error', function(msg, trace) {
  console.log('!!! page.error !!!')
  console.log("Error:    " + msg, "ERROR");
  console.log("trace:     ", trace);
  // console.log("file:     " + trace[0].file, "WARNING");
  // console.log("line:     " + trace[0].line, "WARNING");
  // console.log("function: " + trace[0]["function"], "WARNING");
});
casper.on('resource.error', function(message) {
  console.log('resource.error ==> ', message);
});
