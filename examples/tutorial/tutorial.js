/**
 * The purpose of this tutorial is to tour you 
 * through the main user features of Vantage, 
 * and illustrate what it is capable of doing.
 *
 * For samples on coding vantage, check out the
 * other examples - this isn't the best place to 
 * start.
 */

var Vantage = require('../../')
  , pm2 = require('./pm2')
  , util = require('./../../lib/util')
  , log = (require('./../../lib/logger'))
  , ut = require('util')
  , colors = require('colors')
  ;

var banner =  
  util.pad('', 80, '\n') + '\n' +  
  util.pad('', process.stdout.columns, '#') + '\n' +  
  util.pad('# ', process.stdout.columns-1, ' ') + '#' + '\n' +  
  '#' + util.pad('', (process.stdout.columns/2)-17, ' ') + 'Welcome to the Vantage Tutorial!' + util.pad('', (process.stdout.columns/2)-18, ' ') + ' #' + '\n' +  
  util.pad('# ', process.stdout.columns-1, ' ') + '#' + '\n' +  
  util.pad('', process.stdout.columns, '#') + '\n' + 
  util.pad('', 0, '\n') + '';

var hdr = "#".grey;
  
var commands = function(svr, opt) {

  svr
    .command('step <number>')
    .description('Skips to a step on the tutorial.')
    .action(function(args, cb){
      cb();
    });

  svr
    .command('port')
    .description("Gives Vantage's listening port.")
    .action(function(args, cb){
      console.log(this._port)
      cb();
    });

  svr
    .command('start server <port>')
    .description('Starts a new Vantage Tutorial server.')
    .action(function(args, cb){
      if (isNaN(args.port)) { console.log('\n  Er... Ports are usually numbers...\n'.yellow); cb(); return; }
      if (args.port < 3001) { console.log('\n  Eh, not sure if you are sudo, so pick a port above 3000.\n'.yellow); cb(); return; }
      console.log('\n  Spawning a new Vantage server on port ' + args.port + '...');
      pm2.spawn({
        ports: [args.port]
      }, function(err) {
        if (!err) {
          console.log('  Successfully spawned server.');
        }
        cb('Started!');
      });
    });

}

var steps = {

  step1: function() {
    log.cols(2, [2, hdr], 1, "1. To start, press [enter] 3 times.".cyan).br();
    server.on('client_prompt_submit', steps.step1Listener);
  },

  step1Listener: function(e) {
    this.counter = this.counter || 0;
    if (e == '') {
      this.counter++;
    } else {
      log.br().cols(2, [2, hdr], 1, "Don't get too excited - let's press [enter] 3 times first.".yellow);
      this.counter = 0;
    }
    if (this.counter > 2) {
      log.br().cols(2, [2, hdr], 1, 'Well done! Feels like a normal CLI, right?'.white);
      server.removeListener('client_prompt_submit', steps.step1Listener);
      steps.step2();
    }
  },

  step2: function() {
    log.cols(2, [2, hdr], 1, '2. Now, type "help" and press [enter].\n'.cyan);
    server.on('client_command_executed', steps.step2Listener);
  },

  step2Listener: function(data) {
    if (String(data.command).trim().toLowerCase() == 'help') {
      server.removeListener('client_command_executed', steps.step2Listener);
      log.cols(2, [2, hdr], 1, 'Awesome! Those are all of the available commands you can execute.'.white);
      steps.step3();
    } else {
      log.cols(2, [2, hdr], 1, "Hmmm... Let's try the 'help' command.".yellow);
    }
  },

  step3: function() {
    log.cols(2, [2, hdr], 1, "3. Now, Press the 'up' arrow on your keyboard to pull up the last command. Then press [enter] and run help again.".cyan).br();
    server.on('client_command_executed', steps.step3Listener);
  },

  step3Listener: function(data) {
    if (String(data.command).trim().toLowerCase() == 'help') {
      server.removeListener('client_command_executed', steps.step3Listener);
      log.cols(2, [2, hdr], 1, 'The full command history for the duration of the node session is stored.'.white);
      steps.step4();
    } 
  },

  step4: function() {
    log.cols(2, [2, hdr], 1, "4. You can use tabbed auto-completion, too!. Type 'he' and press the tab key. Then run help.".cyan).br();
    server.on('client_command_executed', steps.step4Listener);
  },

  step4Listener: function(data) {
    if (String(data.command).trim().toLowerCase() == 'help') {
      server.removeListener('client_command_executed', steps.step4Listener);
      steps.step5();
    } 
  },

  step5: function() {
    log.cols(2, [2, hdr], 1, "5. Okay! Now, let's fire up another Vantage server. I made a command for you - enter 'start server [port]'. You can pick the port.".cyan).br();
    server.on('client_command_executed', steps.step5Listener);
  },

  step5Listener: function(data) {
    if (String(data.command).trim().toLowerCase().indexOf('start server') > -1) {
      var port = String(data.command).split(' ');
      port = port[port.length-1];
      if (port < 3001) { return; }
      if (isNaN(port)) { return; }
      server.removeListener('client_command_executed', steps.step5Listener);
      steps.step6(port);
    } 
  },

  step6: function(port) {
    log.br().cols(2, [2, hdr], 1, "6. Great! Now let's connect to it!".cyan);
    log.cols(2, [2, hdr], 1, String("Type 'vantage " + port + "'.").cyan).br();
    server.on('client_command_executed', steps.step6Listener);
  },

  step6Listener: function(data) {
    if (String(data.command).trim().toLowerCase().indexOf('vantage') > -1) {
      server.removeListener('client_command_executed', steps.step6Listener);
      setTimeout(function(){
        steps.step7();
      }, 500)
    } 
  },

  step7: function(port) {
    log.br().cols(2, [2, hdr], 1, "You're in! Check out the prompt: look different?".white);
    log.br().cols(2, [2, hdr], 1, "7. Let's make sure we're on the new server. Type 'port' to get this server's port.".cyan).br();
    server.on('client_command_executed', steps.step7Listener);
  },

  step7Listener: function(data) {
    if (String(data.command).trim().toLowerCase().indexOf('port') > -1) {
      server.removeListener('client_command_executed', steps.step7Listener);
      steps.step8();
    } 
  },

  step8: function(port) {
    log.br().cols(2, [2, hdr], 1, "That looks about right. If you type 'help', you'll notice this server has less commands too. Play around a bit - you'll see everything works the same, but on this new server. You aren't really 'logged in' to it, Vantage is just really good at tricking you.".white);
    log.br().cols(2, [2, hdr], 1, "8. Let's see what this server has to say.  Type 'debug on'.".cyan).br();
    server.on('client_command_executed', steps.step8Listener);
  },

  step8Listener: function(data) {
    if (String(data.command).trim().toLowerCase().indexOf('debug off') > -1) {
      server.removeListener('client_command_executed', steps.step8Listener);
      steps.step9();
    } 
  },

  step9: function(port) {
    log.br().cols(2, [2, hdr], 1, "Sweet!".white);
    log.br().cols(2, [2, hdr], 1, "8. Type 'exit' to go back to the first server.".cyan);
    log.cols(2, [2, hdr], 1, "This doesn't exit the process - just your viewing session.".cyan).br();
    server.on('client_command_executed', steps.step9Listener);
  },

  step9Listener: function(data) {
    if (String(data.command).trim().toLowerCase().indexOf('exit') > -1) {
      server.removeListener('client_command_executed', steps.step8Listener);
      setTimeout(function(){
        steps.step10();
      }, 500)
    } 
  },

  step10: function(port) {
    log.br().cols(2, [2, hdr], 1, "Nice. By the way, you've now used all of Vantage's built in commands:".white);
    log.br().cols(5, 'help [command]');
    log.br().cols(5, 'vantage [server]');
    log.br().cols(5, 'exit');
    log.br().cols(2, [2, hdr], 1, "That concludes the tour and shows some of the things Vantage can do!".white);
    log.br().cols(2, [2, hdr], 1, "To get started building your own Vantage magic, check out the other examples.".white);
    log.br().cols(2, [2, hdr], 1, "9. To fully exit the tutorial, type 'exit -f'.".cyan).br();
  },

}

var server = new Vantage();

log = log(server);

server
  .use(commands)
  .delimiter('tutorial~$')
  .banner(banner)
  .show();

steps.step5();

