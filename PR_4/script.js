    let memory = [0, 0, 0];
    function appendToExpression(value) {
        const expressionInput = document.getElementById('expression');
        expressionInput.value += value; 
    }

    function clearExpression() {
        document.getElementById('expression').value = ''; 
    }

    function calculate() {
        const expressionInput = document.getElementById('expression');
        try {
            const result = eval(expressionInput.value);
            expressionInput.value = result; 
        } catch (error) {
            alert('Ошибка в выражении'); 
        }
    }

    function storeInMemory(index) {
        const expressionInput = document.getElementById('expression');
        const value = parseFloat(expressionInput.value);
        if (!isNaN(value)) {
            memory[index - 1] = value; 
        } else {
            alert('Нет значения для сохранения в память');
        }
    }

    function getFromMemory(index) {
        return memory[index - 1] || 0;
    }
