/* standard.js */
$(window).load(function() {
	$('#adc_{%= CurrentADC.InstanceId %}').adcStatementsOther({
		target : 'jsObj{%= CurrentADC.InstanceId%}',
		width : 400,
		isMultiple: {%= (CurrentQuestion.Type = "open") %},
		controlWidth : '{%= CurrentADC.PropValue("controlWidth") %}',
		columns: {%= CurrentADC.PropValue("columns") %},
		maxWidth : '{%= CurrentADC.PropValue("maxWidth") %}',
		maxImageWidth : '{%= CurrentADC.PropValue("maxImageWidth") %}',
		maxImageHeight : '{%= CurrentADC.PropValue("maxImageHeight") %}',
		forceImageSize : '{%= CurrentADC.PropValue("forceImageSize") %}',
		autoForward: {%= (CurrentADC.PropValue("autoForward") = "1") %},
		animate: {%= (CurrentADC.PropValue("animateResponses") = "1") %},
		animationSpeed: '{%= CurrentADC.PropValue("animationSpeed") %}',
		numberNS: {%= CurrentADC.PropValue("numberNS") %},
		useRange: {%= (CurrentADC.PropValue("useRange") = "1") %},
		responseTextPadding : '{%= CurrentADC.PropValue("responseTextPadding") %}',
		responseTextLineHeight : '{%= CurrentADC.PropValue("responseTextLineHeight") %}',
		showResponseHoverColour: {%= (CurrentADC.PropValue("showResponseHoverColour") = "1") %},
		showResponseHoverFontColour: {%= (CurrentADC.PropValue("showResponseHoverFontColour") = "1") %},
		showResponseHoverBorder: {%= (CurrentADC.PropValue("showResponseHoverBorder") = "1") %},
		controlAlign : '{%= CurrentADC.PropValue("controlAlign") %}',
		otherRID : '{%= CurrentADC.PropValue("otherRID") %}',
		otherQID : '{%= CurrentADC.PropValue("otherQID") %}',
		rangeGradientDirection : '{%= CurrentADC.PropValue("rangeGradientDirection") %}',
		initialRows : {%= CurrentADC.PropValue("initialRows") %},
		{% IF CurrentADC.PropValue("useRange") = "1" Then %}
			range: '{%= CurrentADC.PropValue("responseColourPrimary") %};{%= CurrentADC.PropValue("responseColourSecondary") %};{%= CurrentADC.PropValue("responseColourRangePrimary") %};{%= CurrentADC.PropValue("responseColourRangeSecondary") %}',
		{% EndIF %}
		items : [
			//items here
			{%:= CurrentADC.GetContent("dynamic/standard_open.js").ToText()%}
		]
	});
});