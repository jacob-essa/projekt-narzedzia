const numberStack = [];
const operatorStack = [];
let number = '';
let tokens = [];
let bracketOpen = 0;
// const equation = new collections.deque();

const precedence = new Map;

console.log('Script loaded');

precedence.set('+', 2);
precedence.set('-', 2);
precedence.set('*', 3);
precedence.set('/', 3);
precedence.set('^', 4);
precedence.set('!', 4);
precedence.set('@', 4); 

function UpdateDisplay() 
{
    const mainDisplay = document.getElementById('display');

    let displayText = '';

    if(tokens.length > 0)
    {
        displayText = tokens.join(' ');
    }

    if(number !== '')
    {
        if (displayText !== '')
            displayText += ' ' + number;
        else
            displayText = number;
    }

    if (displayText === '')
        displayText = '0';

    mainDisplay.value = displayText;
    console.log(tokens);

}

function addDigit(digit)
{
    if(number === '0')
    {
        if(digit === '0')
            return;
        else
            number = digit;
    }
    else number += digit;
    UpdateDisplay();
    return;
}
function addOperator(operator)
{
    if(number !== '')
    {
        tokens.push(number)
        tokens.push(operator)
        number = '';
    }
    else
    {
        if(tokens.length > 0)
        {
            if(precedence.has(tokens.at(-1)))
            {
                tokens.pop();
            }
            tokens.push(operator);

        }
    }
    UpdateDisplay();
    return;
}
function clearDisplay(scope)
{
    if(scope === 'all')
    {
        number = '';
        tokens = [];
        UpdateDisplay();
        return;
    }
    if(number !== '')
    {
        number = number.slice(0, -1);
        UpdateDisplay();
        return;
    }
    let last = tokens.at(-1);
    if(precedence.has(last))
    {
        tokens.pop();
        UpdateDisplay();
        return;
    }
    if(last === '(')
    {
        bracketOpen -= 1;
        tokens.pop()
        UpdateDisplay();
        return;
    }
    if(last === ')')
    {
        bracketOpen += 1;
        tokens.pop()
        UpdateDisplay();
        return;
    }
    number = last;
    number = number.slice(0, -1)
    tokens.pop();
    UpdateDisplay();
    return;
       
}
function addBracket(bracket)
{
    if(number !== '')
    {
        tokens.push(number);
        number = '';
    }
    if(bracket === '(')
    {
        bracketOpen += 1;
        tokens.push(bracket);

    }
    else 
        if(bracketOpen > 0 && !precedence.has(tokens.at(-1))) 
        {
            bracketOpen -= 1;
            tokens.push(bracket);
        }
    
    UpdateDisplay();

}


document.addEventListener('DOMContentLoaded', function()
{
    const keys = document.getElementById('keys');
    

    keys.addEventListener('click', function(event)
    {
        const button = event.target.closest('button');
        if (button) 
        {
            const type = button.getAttribute('data-type');
            const value = button.getAttribute('data-value');

            if(type === 'clear') clearDisplay(value);
            else if (type === 'operator') addOperator(value);
            else if (type === 'digit') addDigit(value);
            else if (type === 'evaluation') evaluateEquation();
            else if (type === 'bracket') addBracket(value);

            console.log(`Button pressed: ${type} ${value}`);
        }
    })
});





// function addOperator(operator)
// {
//     equation.pushFront(number);
//     number = '';
//     if(operator == '(')
//     {
//         operatorStack.push(operator);
//         return;
//     }
//     else if(operator == ')')
//     {
//         while (operatorStack.at(-1) != '(')
//         {
//             equation.pushBack(operatorStack.pop());
//         }
//         operatorStack.pop();
//         return;
//     }
//     while (precedence[operator] < precedence[operatorStack.at(-1)])
//     {
//         equation.pushBack(operatorStack.pop())
//     }
//     operatorStack.push(operator);
//     return;

// }