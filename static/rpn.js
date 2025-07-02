let number = '';
let tokens = [];
let bracketOpen = 0;
// const equation = new collections.deque();

const precedence = new Map;

console.log('Script loaded');

precedence.set('+', {value: 2, leftAssoc: true});
precedence.set('-', {value: 2, leftAssoc: true});
precedence.set('*', {value: 3, leftAssoc: true});
precedence.set('/', {value: 3, leftAssoc: true});
precedence.set('^', {value: 4, leftAssoc: false});
precedence.set('!', {value: 4, leftAssoc: false});
precedence.set('@', {value: 4, leftAssoc: false}); 
precedence.set('(', {value: 1, leftAssoc: true}); 

const coolMath = 
{
    '/': '÷',
    '*': '×',
    '!': 'ⁿ√x',
    '@': '√',
    '^': '**'
}



function UpdateDisplay() 
{
    const mainDisplay = document.getElementById('display');
    const RpnDisplay = document.getElementById('displayRPN');

    let displayText = '';
    let displayTextRpn = '';
    

    if(tokens.length > 0)
    {
        displayText = tokens.join(' ');
    }

    if(number !== '')
    {
        if (displayText !== '')
        {
            displayText += ' ' + number;
            tokens.push(number);
            displayTextRpn = infixToRpn(tokens).join(' ')
            displayTextRpn.replace()
            tokens.pop();
        }
        else
        {
            displayText = number;
            displayTextRpn = number;
        }
    }

    if (displayText === '')
    {
        displayText = '0';
        displayTextRpn = '0';
    }

    mainDisplay.value = displayText;
    RpnDisplay.value =  displayTextRpn.replace(/[\/\*!@\^]/g, (match) => coolMath[match]);
    console.log(tokens);


}

function addDigit(digit)
{
    if(number.includes('.') && digit === '.') return;
    if(number === '' && digit === '.')
    {
        number = '0.';
        UpdateDisplay();
        return;
    }
    if(number === '0')
    {
        if(digit === '0')
        {
            return;
        }
        number = (digit === '0') ? 0 : (digit === '.') ? '0.' : digit;
        UpdateDisplay();
        return;
    }
    number += digit;
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
                if(tokens.at(-1) === '(' && precedence.has(tokens.at(-1)))
                    return;
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
    if(tokens.length == 0)
        return;
    let last = tokens.at(-1);
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
    if(precedence.has(last))
    {
        tokens.pop();
        UpdateDisplay();
        return;
    }
    number = last;
    tokens.pop();
    number = number.slice(0, -1)
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
        if(!precedence.has(tokens.at(-1)) && tokens.length > 0)
            tokens.push('*');
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

function infixToRpn(tokens)
{
    let equationQueue = [];
    let operatorStack = [];
    tokens.forEach(token => 
    {
        if(!isNaN(parseFloat(token)))
        {
            equationQueue.push(token);
        }
        else if(token === '(')
        {
            operatorStack.push(token);
        }
        else if (precedence.has(token)) 
        {  
            while
            (
                operatorStack.length > 0  && 
                precedence.has(operatorStack.at(-1)) &&
                (((precedence.get(token).value <= precedence.get(operatorStack.at(-1)).value) && precedence.get(token).leftAssoc) || 
                ((precedence.get(token).value < precedence.get(operatorStack.at(-1)).value) && !precedence.get(token).leftAssoc))
            )
            {
                equationQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        }
        else if (token === ')')
        {
            // We know that if '(' has been input, that the stack cannot be empty
            while(operatorStack.at(-1) !== '(')
            {
                equationQueue.push(operatorStack.pop());
            }
            operatorStack.pop();
        }
    });
    while(operatorStack.length > 0)
        equationQueue.push(operatorStack.pop());
    return equationQueue;
}

function evaluateEquation(equation)
{
    if(number !== '')
    {
        tokens.push(number);
        number = '';
    }
    if(precedence.has(tokens.at(-1)) && tokens.at(-1) !== '@') 
    {
        tokens.pop();
        UpdateDisplay();
    }
    
    let equationRpn = infixToRpn(equation);

    tokens = [];
    UpdateDisplay();

    let numberStack = [];
    let result = 0;
    let element;
    let a, b;
    while(equationRpn.length > 0)
    {
        element = equationRpn.shift();
        if(!isNaN(parseFloat(element)))
        {
            numberStack.push(parseFloat(element));
        }
        else
        {
            switch(element)
            {
                case '+':
                    a = numberStack.pop();
                    b = numberStack.pop();
                    numberStack.push(b + a);
                    break;

                case '-':
                    a = numberStack.pop();
                    b = numberStack.pop();
                    numberStack.push(b - a);
                    break;

                case '*':
                    a = numberStack.pop();
                    b = numberStack.pop();
                    numberStack.push(b * a);
                    break;

                case '/':
                    a = numberStack.pop();
                    b = numberStack.pop();
                    numberStack.push(b / a);
                    break;

                case '^':
                    a = numberStack.pop();
                    b = numberStack.pop();
                    numberStack.push(b ** a);
                    break;
                
                case '@':
                    a = numberStack.pop();
                    numberStack.push(a ** 0.5);
                    break;
                
                case '!':
                    a = numberStack.pop();
                    b = numberStack.pop();
                    numberStack.push(b ** (1 / a));
                    break;
            }
        }
    }
    number = numberStack.pop();
    UpdateDisplay();
}

document.addEventListener('DOMContentLoaded', function()
{
    const keys = document.getElementById('keys');
    
    UpdateDisplay();
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
            else if (type === 'evaluation') evaluateEquation(tokens);
            else if (type === 'bracket') addBracket(value);
            else if (type === 'cute') UpdateDisplay();

            console.log(`Button pressed: ${type} ${value}`);
        }
    })
});
