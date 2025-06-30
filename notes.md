## For real time RPN:

Inputs from a user can be:
- a digit
    - If the *number* is empty and the digit == '0' -> do nothing
    - Else add the digit to the number string
- an operator
    - If the number is empty replace the previous operator
    - If the number is not empty pop it to the stack
        

## For string based RPN

Inputs can be:
- a digit
    - If the *number* is '0' and the digit == '0' -> do nothing
        - If the digit is not zero, replace the zero
    - Else add the digit to the number string
- an operator
    - If the number is not empty, 
        - push it to the deque
        - push the operator to the deque
        - clear the number
    - If it is empty
        - if the last token is a operator
         - pop the last element of the deque
         - push the new operator
- a bracket
    - If is is a left bracket 
        - push it to the queue
        - increment bracketOpen
    - If it is a right bracket
        - check if bracketOpen is greater than zero
            - push the right bracket and decrement bracketOpen
        - else do an error message
- a clear call
    - If it is clear all
        set the deque to empty
    - If it is clear input
        - check if number is not empty
            -  remove the last element
        - if the number is empty
            - get the last element of the deque
            - If it is a number
                - number = token.at(-1) 
                - remove last element of number
            - If it is an operator
                - remove it
            - If it is a bracket
                - right bracket
                    - remove it
                    - increment bracketOpen
                - left bracket
                    - remove it
                    - decrement bracketOpen
- an evaluation call
    - run the infixToRpn(tokens), then the evaluateRPN(rpnString) function
    
## infixToRpn

Input is an array of strings

Output will be an array of strings

While there are tokens:
    - If it is a left bracket
        - Push to the operatorStack
    - If it is a right bracket
        - While operatorStack.top() is not left bracket
            - equationQueue.push(operatorStack.pop())
        - Remove the left bracket (one more pop)
    - If it is an operator (newOperator)
        - While precedence[newOperator] < precedence[operatorStack.top()]
            - equationQueue.push(operatorStack.pop())
    - If it is a number
        - Push to the equation queue

Return equation queue (as it is an array)