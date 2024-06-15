function rotatePoint(x, y, theta) { // вращает точку                                
	var thetaRad = theta * (Math.PI / 180); 
	var rotX = Math.cos(thetaRad) * x - Math.sin(thetaRad) * y; 
	var rotY = Math.sin(thetaRad) * x + Math.cos(thetaRad) * y; 

	return {
		x: rotX,
		y: rotY
	};
}

function randInt(min, max) {
	return Math.floor((Math.random() * max) + min); // возвращает псевдослучайное число с плавающей запятой, 
}  //которое больше или равно нулю и меньше единицы с приблизительно равномерным распределением в этом диапазоне.
//В дальнейшем это число можно «отмасштабировать», привести к нужному диапазону. Выбор начального числа для алгоритма
// генерации случайных чисел происходит автоматически (зависит от реализации) и не может быть изменён пользователем.