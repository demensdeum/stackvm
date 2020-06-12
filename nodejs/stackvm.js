const OPCODE_PRINT_STACK = 1

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
      if (character == OPCODE_PRINT_STACK) {
        var output = "";
        for (let stackFirst = this.stack.pop(); stackFirst != null; stackFirst = this.stack.pop()) {
          output += stackFirst.value;
        }
        console.log(output)
      }
      else {
        this.stack.push(character);
      }
    }
  }

}

const stackVM = new StackVM();
stackVM.interpret("MVkcatS olleH" + OPCODE_PRINT_STACK);
