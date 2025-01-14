const OPCODE_START_PRINT_STACK = 'П';
const OPCODE_END_PRINT_STACK = 'п';
const OPCODE_SUM = '+';
const OPCODE_SUB = '-';
const OPCODE_MUL = '*';
const OPCODE_DIV = '/';
const OPCODE_PARSE_NUMBER_START = "Н";
const OPCODE_PARSE_NUMBER_END = "н";
const OPCODE_CALCULATOR_MODE = "К";
const STACKVM_ARITHMETIC_OPERATIONS = [OPCODE_SUM, OPCODE_SUB, OPCODE_DIV, OPCODE_MUL];

const STACKVM_OPERATION_PRIORITIES = {
  '+' : 6,
  '-' : 6,
  '*' : 5,
  '/' : 5
};

function reverseString(string) {
    return string.split("").reverse().join("");
}

class Node {

  next = null
  value = null

  constructor(next, value) {
    this.next = next
    this.value = value
  }
}

class Stack {

  #first = null

  push(something) {
    this.first = new Node(this.first, something);
  }

  pop(something) {
    const output = this.first
    if (output != null) {
      this.first = output.next;
    }
    else {
      this.first = null;
    }
    return output
  }
}

class StackVM {

  constructor() {
    this.stack = new Stack();
  }

  interpret(program) {
    console.log("Interpret: " + program);
    for (let character of program) {
      if (character == OPCODE_START_PRINT_STACK) {
        for (let stackFirst = this.stack.pop(); stackFirst.value != OPCODE_END_PRINT_STACK; stackFirst = this.stack.pop()) {
          process.stdout.write(String(stackFirst.value));
        }
        process.stdout.write("\n")
      }
      else if (character == OPCODE_PARSE_NUMBER_START) {
        var numberString = "";
        for (let stackFirst = this.stack.pop(); stackFirst.value != OPCODE_PARSE_NUMBER_END; stackFirst = this.stack.pop()) {
          numberString += stackFirst.value;
        }
        this.stack.push(numberString);
      }
      else if (character == OPCODE_SUM) {
        let rhs = parseInt(this.stack.pop().value);
        let lhs = parseInt(this.stack.pop().value);
        let result = lhs + rhs;
        this.stack.push(result);
      }
      else if (character == OPCODE_SUB) {
        let rhs = parseInt(this.stack.pop().value);
        let lhs = parseInt(this.stack.pop().value);
        let result = lhs - rhs;
        this.stack.push(result);
      }
      else if (character == OPCODE_MUL) {
        let rhs = parseInt(this.stack.pop().value);
        let lhs = parseInt(this.stack.pop().value);
        let result = lhs * rhs;
        this.stack.push(result);
      }
      else if (character == OPCODE_DIV) {
        let rhs = parseInt(this.stack.pop().value);
        let lhs = parseInt(this.stack.pop().value);
        let result = lhs / rhs;
        this.stack.push(result);
      }
      else if (character == OPCODE_CALCULATOR_MODE) {
        const readline = require('readline');
        const promptInterface = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        promptInterface.question('Calculator mode: ', (inputString) => {
          promptInterface.close();
          var outputProgram = "";

          var isNumberParseMode = false;
          var parsedNumber = "";

          for (let calculatorModeCharacter of inputString) {
            let parsedInt = parseInt(calculatorModeCharacter);
            if (isNaN(parsedInt) == false) {
              if (isNumberParseMode == false) {
                outputProgram += OPCODE_PARSE_NUMBER_END;
              }
              isNumberParseMode = true;
              parsedNumber += String(parsedInt);
            }
            else {
              if (isNumberParseMode) {
                isNumberParseMode = false;
                outputProgram += reverseString(parsedNumber);
                outputProgram += OPCODE_PARSE_NUMBER_START
                parsedNumber = "";
              }
              if (calculatorModeCharacter == '(') {
                this.stack.push(calculatorModeCharacter);
              }
              else if (calculatorModeCharacter == ')') {
                for (let stackFirst = this.stack.pop(); stackFirst.value != '('; stackFirst = this.stack.pop()) {
                  outputProgram += String(stackFirst.value);
                }
              }
              else if (STACKVM_ARITHMETIC_OPERATIONS.includes(calculatorModeCharacter)) {
                  let first = this.stack.pop();
                  if (first != null) {
                      let operation = first.value
                      let lhsPriority = STACKVM_OPERATION_PRIORITIES[calculatorModeCharacter];
                      let rhsPriority = STACKVM_OPERATION_PRIORITIES[operation];
                      if (STACKVM_ARITHMETIC_OPERATIONS.includes(operation) && lhsPriority >= rhsPriority) {
                        outputProgram += first.value;
                      }
                      else {
                        this.stack.push(operation);
                      }
                  }
                  this.stack.push(calculatorModeCharacter);
              }


            }
          }

          if (isNumberParseMode) {
            outputProgram += reverseString(parsedNumber);
            outputProgram += OPCODE_PARSE_NUMBER_START;
            isNumberParseMode = false;
          }

          for (let stackFirst = this.stack.pop(); stackFirst != null; stackFirst = this.stack.pop()) {
            outputProgram += stackFirst.value;
          }
          outputProgram =
          OPCODE_END_PRINT_STACK +
          outputProgram +
          reverseString("Result: ") +
          OPCODE_START_PRINT_STACK;
          this.interpret(outputProgram);
        });
      }
      else {
        this.stack.push(character);
      }
    }
  }

}

const stackVM = new StackVM();
stackVM.interpret(
  OPCODE_END_PRINT_STACK +
  reverseString("Hello StackVM") +
  OPCODE_START_PRINT_STACK +
  OPCODE_CALCULATOR_MODE
);
