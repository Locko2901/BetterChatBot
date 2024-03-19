module.exports = {
    apps : [{
      name: 'ChatBot',
      script: './ChatBot/src/index.js',
      watch: true,
    }, {
      name: 'ExampleBot',
      script: './ExampleBot/src/index.js',
      watch: true,
    }]
  };