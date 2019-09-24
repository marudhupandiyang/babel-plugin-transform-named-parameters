const babel = require("@babel/core");
const namedParamertsRewrite = require('./index');

const tests = [
  {
    input: `
function hello(firstName, lastName) {
  console.log(firstName, lastName);
}

hello(lastName = 'Pandiyan', firstName = 'Marudhu');
`,
      output: `
function hello(firstName, lastName) {
  console.log(firstName, lastName);
}

hello("Marudhu", "Pandiyan");
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
    if (result.code.trim() === tests[i].output.trim()) {
      console.log(`Test ${i + 1} Passed.`);
    } else {
      throw new Error(`Failed Matching \ninput: ${tests[i].input}\n\nActual: ${result.code}\n\nExpected: ${tests[i].output}`);
    }
  } catch (ex) {
    console.log(`Test ${i} Failed.`, ex);
    console.error(`Error while executing ${i}`, ex);
  }
}
