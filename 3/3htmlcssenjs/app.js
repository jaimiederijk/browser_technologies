//(function() {
	var app = {
		init: function() {
			if ( 'draggable' in document.createElement("div") && !/Mobile|Android|Slick\/|Kindle|BlackBerry|MSIE|Opera Mini|MSIE|Opera Mobi/i.test(navigator.userAgent)  ) {
				dragEvents.attachEvent();
				enhance.createList();
				enhance.inputsHidden();
			}
		}
	};

	var htmlElements = {
		labels: document.querySelectorAll('label'),
		inputs: document.querySelectorAll('input'),
		list:document.querySelector('#list'),
		suggestion:document.querySelector('#suggestions')
	};

	var enhance = {
		createList : function () {
			var list = htmlElements.list;
			var dragList = "<h2>Benodigheden voor een tosti</h2><div id='draglist'></div>";//
			list.innerHTML = dragList;
		},
		inputsHidden : function () {
			var inputs = htmlElements.inputs;
			for (var i = 0; i < inputs.length; i++) {
				inputs[i].classList.add('hidden');
			};
		}
	};

	var dragEvents = {
		dragSrcEl : null,
		attachEvent: function() {

			var labels = htmlElements.labels;
			for (var i = 0; i < labels.length; i++) {
				labels[i].addEventListener('dragstart',dragEvents.handleDragStart,false);
			};
			htmlElements.list.addEventListener('dragover',dragEvents.handleDragOver,false);
			htmlElements.list.addEventListener('drop', dragEvents.handleDrop, false);
			htmlElements.suggestion.addEventListener('dragover',dragEvents.handleDragOver,false);
			htmlElements.suggestion.addEventListener('drop', dragEvents.handleDrop, false);
		},
		handleDragStart : function(event) {

			dragEvents.dragSrcEl = this;

			//event.dataTransfer.effectAllowed = 'copy';
			event.dataTransfer.setData('text', this.id);
		},
		handleDragOver : function(event) {
			if (event.preventDefault) {
		  		event.preventDefault();
		  	} else {
		  		event.returnValue = false;
		  	}
		  	event.dataTransfer.dropEffect = 'copy';
		},
		handleDrop:function (event) {
			if (event.stopPropagation) {
				event.stopPropagation(); // stops the browser from redirecting.
			}
			if (dragEvents.dragSrcEl != this) {
				//dragEvents.dragSrcEl.innerHTML = this.innerHTML;
				var data = event.dataTransfer.getData('text');
				var dataInput = data+"-input"
				// var li = document.createElement("<li>"+data+"</li>");
				event.target.appendChild(document.getElementById(data));
				event.target.appendChild(document.getElementById(dataInput));
			}

  			return false;
		}


	};
	app.init();
//}());