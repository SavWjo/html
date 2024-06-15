function search(twoD,oneD){
	// Ищет двумерный массив, чтобы узнать, содержит ли он одномерный массив.
	for(var i=0;i<twoD.length;i++){
		if(twoD[i][0] == oneD[0] && twoD[i][1] == oneD[1]) {
			return true;
		}
	}
	return false;
}

function floodFill(hex, side, index, deleting) {
	if (hex.blocks[side] === undefined || hex.blocks[side][index] === undefined) return;

	//сохраняет цвет
	var color = hex.blocks[side][index].color;
	//вложенные циклы for для навигации по блокам
	for(var x =-1;x<2;x++){
		for(var y =-1;y<2;y++){
			//убедимся, что они не являются диагоналями
			if(Math.abs(x)==Math.abs(y)){continue;}
			//рассчитываем сторону, которую исследовали, используя моды
			var curSide =(side+x+hex.sides)%hex.sides;
			//вычисляем индекс
			var curIndex = index+y;
			//проверяем, что блок существует на этой стороне и индексе
			if(hex.blocks[curSide] === undefined){continue;}
			if(hex.blocks[curSide][curIndex] !== undefined){
				// проверка эквивалентности цвета, если он уже исследован и не удален
				if(hex.blocks[curSide][curIndex].color == color && search(deleting,[curSide,curIndex]) === false && hex.blocks[curSide][curIndex].deleted === 0 ) {
					//добавляем это в массив уже исследованных
					deleting.push([curSide,curIndex]);
					//вызов со следующим исследованным блоком
					floodFill(hex,curSide,curIndex,deleting);
				}
			}
		}
	}
}

function consolidateBlocks(hex,side,index){
	//записываем, какие стороны были изменены
	var sidesChanged =[];
	var deleting=[];
	var deletedBlocks = [];
	//добавим начальный регистр
	deleting.push([side,index]);
	//fill deleting	
	floodFill(hex,side,index,deleting);
	//убедимся, что нужно удалить более 3 блоков
	if(deleting.length<3){return;}
	var i;
	for(i=0; i<deleting.length;i++) {
		var arr = deleting[i];
		//просто проверяем, что массивы такие, какими они должны быть
		if(arr !== undefined && arr.length==2) {
			//добавляем к измененным сторонам, если их там нет
			if(sidesChanged.indexOf(arr[0])==-1){
				sidesChanged.push(arr[0]);
			}
			//отмечаем как удаленное
			hex.blocks[arr[0]][arr[1]].deleted = 1;
			deletedBlocks.push(hex.blocks[arr[0]][arr[1]]);
		}
	}

	// добавляем баллы
	var now = MainHex.ct;
	if(now - hex.lastCombo < settings.comboTime ){
		settings.comboTime = (1/settings.creationSpeedModifier) * (waveone.nextGen/16.666667) * 3;
		hex.comboMultiplier += 1;
		hex.lastCombo = now;
		var coords = findCenterOfBlocks(deletedBlocks);
		hex.texts.push(new Text(coords['x'],coords['y'],"x "+hex.comboMultiplier.toString(),"bold Q","#fff",fadeUpAndOut));
	}
	else{
		settings.comboTime = 240;
		hex.lastCombo = now;
		hex.comboMultiplier = 1;
	}
	var adder = deleting.length * deleting.length * hex.comboMultiplier;
	hex.texts.push(new Text(hex.x,hex.y,"+ "+adder.toString(),"bold Q ",deletedBlocks[0].color,fadeUpAndOut));
		hex.lastColorScored = deletedBlocks[0].color;
	score += adder;
}