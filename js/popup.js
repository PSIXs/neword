var storage = chrome.storage.local;

var ticker;

var inputKeywords = document.querySelector('input#keywords');

function saveChanges() {
	var keywordList = inputKeywords.value;
	var fields = new Array();

	// $("form p > input").each(function(i) {
	// 	fields[i] = $(this).val().toString();
	// });
	// if (typeof fields != "undefined") keywordList = fields.join('|');

	// chrome.extension.sendMessage({command: "highlight"}, function(response) {
	// 	console.log(response.message);
	// });

	//message to tab
	// chrome.tabs.getSelected(null, function(tab) {
	// 	chrome.tabs.sendMessage(tab.id, {command: "update"}, function(response) {
	// 		console.log(response.message);
	// 	});
	// });

	//save
	keywordList = JSON.stringify(keywordList);
	$('#debug').text(keywordList);
	storage.set({'keywords': keywordList}, function() {
		message('Settings saved');
	});
}

function loadChanges() {
	var fields = new Array();
	var DOMAIN = 0, KEYWORDS = 1;
	
	//load
	storage.get('keywords', function(items) {
		if (items.keywords) {
			// fields = JSON.parse(items.keywords).split("|");
			// inputKeywords.value = fields[KEYWORDS];
			inputKeywords.value = JSON.parse(items.keywords);
			$('.keywords').importTags(inputKeywords.value);
		}
	});
}

function message(msg) {
	var message = document.querySelector('#message');
	// message.innerText = msg;
	message.innerHTML = '<img src="img/ajax-loader.gif">';
	if (ticker) clearTimeout(ticker);
	ticker = setTimeout(function() {
		message.innerText = '';
	}, 750);
}

// var $j = jQuery.noConflict();

function init() {
	swatch = ['yellow', 'blue', 'green', 'red', 'turq', 'orange', 'purple', 'pink', 'lilac', 'silver'];	//colours

	$('.keywords').tagsInput({
		width: 'auto',
		height: 'auto',
		defaultText: 'Add keyword',
		placeholderColor: '#999999',
		interacgive: false,
	
		onChange: function(elem, elem_tags)
		{
			$('.taghighlight').each(function(index) {
				$(this).addClass('crayon-'+swatch[index % 10]);
			});
			$('.taghighlight span').each(function(index) {
				$(this).click(function() {
					label = $(this).text().trim();
					$('#keywords').removeTag(label);

					$('#keywords_tag').val(label).trigger("keypress").focus();
				});
			});
		},
		onAddTag: function(elem, elem_tags)
		{
			saveChanges();
		},
		onRemoveTag: function(elem, elem_tags)
		{
			saveChanges();
		}
	});
	
	function refresh() {
		var redone = new Array();
		
		$('.taghighlight').each(function(i) {
			redone[i] = $(this).text().slice(0, -1).trim();
		});

		inputKeywords.value = redone.join(',');
		var temp = inputKeywords.value;

		$('.keywords').importTags('');
		$('.keywords').importTags(temp);
	}
	
	function attachEdit() {
		$('.taghighlight span').on('click', function() {
			$('#keywords_tag').val($(this).text());
			console.log($(this).text());
		});
	}

	$('.tagsinput').sortable({
		items: '> span',
		cursor: 'move',
		opacity: 0.5,
		update: function( event, ui ) {
			refresh();
			saveChanges();
			attachEdit();
		},
		//change, sort, start
		change: function( event, ui ) {
			// $('.taghighlight[name|="crayon"]').removeClass();
			// $('.taghighlight').each(function(index) {
			// 	$(this).addClass('crayon-'+swatch[index % 10]);
			// });
		}
	});
	
	$('.tagsinput input').bind('paste', function () {
		var element = this;
		setTimeout(function () {
			var pasted = $(element).val();
			var existing = document.querySelector('input#keywords').value;
			$('.keywords').importTags(existing +","+ pasted);
			saveChanges();
		}, 100);
	});

	$('#unhighlight').click(function () {
		$('.toggle').toggle();
		//re-highlight
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendMessage(tab.id, {command: "unhighlight"}, function(response) {
				// console.log(response.message);
			});
		});
	});

	$('#rehighlight').click(function () {
		$('.toggle').toggle();
		//re-highlight
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendMessage(tab.id, {command: "rehighlight"}, function(response) {
				// console.log(response.message);
			});
		});
	});

	loadChanges();
	attachEdit();
}

document.addEventListener('DOMContentLoaded', function () {
	init();
});
