const babel = require("@babel/core");
const namedParamertsRewrite = require('./index');

const tests = [
  {
    input: `
    function hello(firstName, lastName) {
      console.log(firstName, lastName);
    }

    hello(lastName = 'Marudhu', firstName = 'Pandiyan');
    `,
      output: `
    function hello(firstName, lastName) {
      console.log(firstName, lastName);
    }

    hello('Marudhu', 'Pandiyan');
    `,
  }
];

const babelOptions = {
  plugins: [
    babel.createConfigItem(namedParamertsRewrite),
  ],
};

for(let i = 0; i < tests.length; i += 1) {
  try {
    const result = babel.transformSync(tests[i].input, babelOptions);
    // console.log(JSON.stringify(result, 2));
  } catch (ex) {
    console.error(`Error while executing ${i}`, ex);
  }
}
