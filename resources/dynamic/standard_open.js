/* standard_single.js */
{% 
Dim i 
Dim ar = CurrentQuestion.ParentLoop.AvailableResponses
Dim inputName
Dim inputId
Dim caption
Dim resource

For i = 1 To ar.Count 
	inputName = CurrentQuestion.iteration(ar[i].Index).InputName()
	inputId   = inputName
	caption   = ar[i].Caption
%}
	{caption : '{%= caption %}', element : $('#{%= inputId%}')}{%= On(i < ar.Count, ",", "") %}
{% Next %}