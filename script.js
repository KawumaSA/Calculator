        document.addEventListener('DOMContentLoaded', function() {
            // Calculator state
            let currentOperand = '0';
            let previousOperand = '';
            let operation = null;
            let resetCurrentOperand = false;
            let lastAnswer = null;
            
            // DOM elements
            const currentOperandElement = document.querySelector('.current-operand');
            const previousOperandElement = document.querySelector('.previous-operand');
            const errorMessageElement = document.getElementById('error-message');
            
            // Prevent default touch behaviors that could cause scrolling
            document.addEventListener('touchstart', function(e) {
                if (e.target.tagName === 'BUTTON') {
                    e.preventDefault();
                }
            }, { passive: false });
            
            document.addEventListener('touchmove', function(e) {
                e.preventDefault();
            }, { passive: false });
            
            // Button event listeners
            document.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', () => {
                    const buttonText = button.textContent;
                    
                    if (button.classList.contains('clear')) {
                        clear();
                    } else if (button.classList.contains('delete')) {
                        deleteLast();
                    } else if (button.classList.contains('operator')) {
                        chooseOperation(buttonText);
                    } else if (button.classList.contains('equals')) {
                        compute();
                    } else if (button.textContent === '.') {
                        inputDecimal();
                    } else if (button.classList.contains('recall')) {
                        recallAnswer();
                    } else {
                        inputNumber(buttonText);
                    }
                    
                    updateDisplay();
                });
            });
            
            // Keyboard support
            document.addEventListener('keydown', event => {
                if (event.key >= '0' && event.key <= '9') {
                    inputNumber(event.key);
                } else if (event.key === '.') {
                    inputDecimal();
                } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
                    chooseOperation(convertOperator(event.key));
                } else if (event.key === 'Enter' || event.key === '=') {
                    compute();
                } else if (event.key === 'Backspace') {
                    deleteLast();
                } else if (event.key === 'Escape') {
                    clear();
                } else if (event.key === 'a' || event.key === 'A') {
                    recallAnswer();
                }
                updateDisplay();
            });
            
            // Input number
            function inputNumber(number) {
                if (resetCurrentOperand) {
                    currentOperand = '';
                    resetCurrentOperand = false;
                }
                
                if (currentOperand === '0') {
                    currentOperand = number;
                } else {
                    currentOperand += number;
                }
                
                hideError();
            }
            
            // Input decimal
            function inputDecimal() {
                if (resetCurrentOperand) {
                    currentOperand = '0';
                    resetCurrentOperand = false;
                }
                
                if (!currentOperand.includes('.')) {
                    currentOperand += '.';
                }
                
                hideError();
            }
            
            // Choose operation
            function chooseOperation(op) {
                if (currentOperand === '' && previousOperand === '') return;
                
                if (currentOperand === '') {
                    operation = op;
                    updateDisplay();
                    return;
                }
                
                if (previousOperand !== '') {
                    compute();
                }
                
                operation = op;
                previousOperand = currentOperand;
                resetCurrentOperand = true;
                
                hideError();
            }
            
            // Compute result
            function compute() {
                let computation;
                const prev = parseFloat(previousOperand);
                const current = parseFloat(currentOperand);
                
                if (isNaN(prev) || isNaN(current)) return;
                
                switch (operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '-':
                        computation = prev - current;
                        break;
                    case '×':
                        computation = prev * current;
                        break;
                    case '÷':
                        if (current === 0) {
                            showError('Cannot divide by zero');
                            return;
                        }
                        computation = prev / current;
                        break;
                    default:
                        return;
                }
                
                // Store the answer for recall
                lastAnswer = computation.toString();
                
                currentOperand = computation.toString();
                operation = null;
                previousOperand = '';
                resetCurrentOperand = true;
                
                hideError();
            }
            
            // Recall last answer
            function recallAnswer() {
                if (lastAnswer !== null) {
                    if (resetCurrentOperand || currentOperand === '0') {
                        currentOperand = lastAnswer;
                    } else {
                        currentOperand += lastAnswer;
                    }
                    resetCurrentOperand = false;
                } else {
                    showError('No previous answer to recall');
                }
            }
            
            // Clear calculator
            function clear() {
                currentOperand = '0';
                previousOperand = '';
                operation = null;
                resetCurrentOperand = false;
                
                hideError();
            }
            
            // Delete last character
            function deleteLast() {
                if (resetCurrentOperand) {
                    currentOperand = '0';
                    resetCurrentOperand = false;
                    return;
                }
                
                if (currentOperand.length === 1) {
                    currentOperand = '0';
                } else {
                    currentOperand = currentOperand.slice(0, -1);
                }
                
                hideError();
            }
            
            // Update display
            function updateDisplay() {
                currentOperandElement.textContent = currentOperand;
                
                if (operation != null) {
                    previousOperandElement.textContent = `${previousOperand} ${operation}`;
                } else {
                    previousOperandElement.textContent = '';
                }
            }
            
            // Convert keyboard operators to display operators
            function convertOperator(keyboardOperator) {
                if (keyboardOperator === '/') return '÷';
                if (keyboardOperator === '*') return '×';
                return keyboardOperator;
            }
            
            // Show error message
            function showError(message) {
                errorMessageElement.textContent = message;
                errorMessageElement.style.display = 'block';
                setTimeout(hideError, 3000);
            }
            
            // Hide error message
            function hideError() {
                errorMessageElement.style.display = 'none';
            }
            
            // Prevent zoom on double-tap for mobile
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function (event) {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
        });