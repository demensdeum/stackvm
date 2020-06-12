const OPCODE_START_PRINT_STACK = 'З'
const OPCODE_END_PRINT_STACK = 'з'
const OPCODE_SUM = 'С'

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
    console.log("Trying to interpret program: " + program);
    for (let character of program) {
      if (character == OPCODE_START_PRINT_STACK) {
        for (let stackFirst = this.stack.pop(); stackFirst.value != OPCODE_END_PRINT_STACK; stackFirst = this.stack.pop()) {
          process.stdout.write(String(stackFirst.value));
        }
        process.stdout.write("\n")
      }
      else if (character == OPCODE_SUM) {
        let lhs = parseInt(this.stack.pop().value);
        let rhs = parseInt(this.stack.pop().value);
        let result = lhs + rhs;
        this.stack.push(result);
      }
      else {
        this.stack.push(character);
      }
    }
  }

}

const stackVM = new StackVM();
stackVM.interpret(OPCODE_END_PRINT_STACK + "MVkcatS olleH" + OPCODE_START_PRINT_STACK + OPCODE_END_PRINT_STACK + "23" + OPCODE_SUM + OPCODE_START_PRINT_STACK);
