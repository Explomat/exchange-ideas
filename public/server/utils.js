function toJSON(data){
	return tools.object_to_text(data, 'json');
}

function log(message){
	EnableLog('exchange-ideas');
	LogEvent('exchange-ideas', message);
}

function setMessage(type, message){
	return {
		type: type,
		message: message
	}
}

function setSuccess(data){
	var m = setMessage('success');
	m.data = data;
	return toJSON(m);
}

function setError(message){
	log(message);
	return toJSON(setMessage('error', message));
}

function notificate(templateCode, primaryId, text, secondaryId){
	tools.create_notification(templateCode, primaryId, text, secondaryId);
}

function toJSObject(xmlElem) {
	var returnObj = {};
	for (el in xmlElem){
		try {
			returnObj.SetProperty(el.Name, String(el.Value));
		} catch(e) {}
	}
	return returnObj;
}

function toJSArray(xmlArray) {
	var returnArr = [];

	for (el in xmlArray) {
		returnArr.push(toJSObject(el));
	}

	return returnArr;
}

function createResourseWithImage(userId, userFullname, fileName, fileType, imageBinary) {
	var docResource = tools.new_doc_by_name('resource'); 
	docResource.TopElem.person_id = userId; 
	docResource.TopElem.allow_unauthorized_download = true;
	docResource.TopElem.allow_download = true; 
	docResource.TopElem.file_name = fileName;
	docResource.TopElem.name = fileName;
	docResource.TopElem.type = fileType;
	docResource.TopElem.person_fullname = userFullname;
	docResource.BindToDb();
	docResource.TopElem.put_str(file, fileName); 
	docResource.Save();

	return docResource;
}