<%

curUserID = 6711785032659205612; // me test

var Topics = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/topic.js');
DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/topic.js');

var Ideas = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/idea.js');
DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/idea.js');

var Comments = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/comment.js');
DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/comment.js');

var Utils = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');
DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');

function get_Topics(queryObjects) {
	var topicId = queryObjects.GetOptProperty('id');
	var topics = [];

	try {
		topics = Topics.list(topicId);
	} catch(e) {
		return Utils.setError(e);
	}
	
	return Utils.setSuccess(Utils.toJSArray(topics));
}

function post_Topics(queryObjects) {
	var topicId = queryObjects.GetOptProperty('id');

	var formData = queryObjects.Request.Form;
	var title = formData.GetOptProperty('title');
	var description = formData.GetOptProperty('description');
	var file = formData.GetOptProperty('file');
	var resId = null;

	// create new
	if (topicId == undefined) {
		try {
			var userDoc = OpenDoc(UrlFromDocID(curUserID));

			if (file != undefined) {
				var resDoc = Utils.createResourseWithImage(curUserID, String(userDoc.TopElem.fullname), file.fileName, file.fileType, file);
				resId = resDoc.DocID;
			}

			var topicDoc = Topics.create(title, description, resId, curUserID, userDoc.TopElem.fullname);
			return Utils.setSuccess(Utils.toJSObject(topicDoc.TopElem));
		} catch(e) {
			return Utils.setError(e);
		}
	}

	//update
	try {
		if (file != undefined) {
			//удаляем старый файл
			var curDoc = OpenDoc(UrlFromDocID(Int(topicId)));
			DeleteDoc(UrlFromDocID(Int(curDoc.TopElem.image_id)))

			//созлаем новый
			var userDoc = OpenDoc(UrlFromDocID(curUserID));
			var resDoc = Utils.createResourseWithImage(curUserID, String(userDoc.TopElem.fullname), file.fileName, file.fileType, file);
			resId = resDoc.DocID;
		}

		var topicDoc = Topics.update(topicId, {
			title: title,
			description: description,
			image_id: resId
		});
		return Utils.setSuccess(Utils.toJSObject(topicDoc.TopElem));
	} catch(e) {
		return Utils.setError(e);
	}
}

function delete_Topics(queryObjects) {
	var data = tools.read_object(queryObjects.Body);
	var topicId = data.GetOptProperty('id');

	if (topicId != undefined) {
		try {
			Topics.remove(topicId);
			return Utils.setSuccess();
		} catch(e) {
			return Utils.setError(e);
		}
	}

	return Utils.setError('Unknown parameters');
}


function get_Ideas(queryObjects) {
	var ideaId = queryObjects.GetOptProperty('id');
	var topicId = queryObjects.GetOptProperty('topic_id');
	var ideas = [];

	try {
		ideas = Ideas.list(ideaId, topicId);
	} catch(e) {
		return Utils.setError(e);
	}

	if (ideaId != undefined) {
		return Utils.setSuccess(Utils.toJSObject(ideas));
	}
	
	return Utils.setSuccess(Utils.toJSArray(ideas));
}

function post_Ideas(queryObjects) {
	var ideaId = queryObjects.GetOptProperty('id');

	var formData = queryObjects.Request.Form;
	var title = formData.GetOptProperty('title');
	var description = formData.GetOptProperty('description');
	var file = formData.GetOptProperty('file');
	var topicId = formData.GetOptProperty('topic_id');
	var resId = null;

	// create new
	if (ideaId == undefined) {
		try {
			var userDoc = OpenDoc(UrlFromDocID(curUserID));

			if (file != undefined) {
				var resDoc = Utils.createResourseWithImage(curUserID, String(userDoc.TopElem.fullname), file.fileName, file.fileType, file);
				resId = resDoc.DocID;
			}

			var topicDoc = OpenDoc(UrlFromDocID(Int(topicId)));
			var ideaDoc = Ideas.create(title, description, resId, curUserID, userDoc.TopElem.fullname, topicId, topicDoc.TopElem.title);
			return Utils.setSuccess(Utils.toJSObject(ideaDoc.TopElem));
		} catch(e) {
			return Utils.setError(e);
		}
	}

	//update
	try {
		if (file != undefined) {
			//удаляем старый файл
			var curDoc = OpenDoc(UrlFromDocID(Int(ideaId)));
			DeleteDoc(UrlFromDocID(Int(curDoc.TopElem.image_id)))

			//созлаем новый
			var userDoc = OpenDoc(UrlFromDocID(curUserID));
			var resDoc = Utils.createResourseWithImage(curUserID, String(userDoc.TopElem.fullname), file.fileName, file.fileType, file);
			resId = resDoc.DocID;
		}

		var ideaDoc = Topics.update(ideaId, {
			title: title,
			description: description,
			image_id: resId
		});
		return Utils.setSuccess(Utils.toJSObject(ideaDoc.TopElem));
	} catch(e) {
		return Utils.setError(e);
	}
}

function delete_Ideas(queryObjects) {
	var data = tools.read_object(queryObjects.Body);
	var ideaId = data.GetOptProperty('id');

	if (ideaId != undefined) {
		try {
			Ideas.remove(ideaId);
			return Utils.setSuccess();
		} catch(e) {
			return Utils.setError(e);
		}
	}

	return Utils.setError('Unknown parameters');
}


function get_Comments(queryObjects) {
	var parentId = queryObjects.GetOptProperty('parent_id');
	var ideaId = queryObjects.GetOptProperty('idea_id');
	var comments = [];

	try {
		comments = Comments.list(parentId, ideaId);
	} catch(e) {
		return Utils.setError(e);
	}
	
	return Utils.setSuccess(Utils.toJSArray(comments));
}

function post_Comments(queryObjects) {
	var commentId = queryObjects.GetOptProperty('id');

	var data = tools.read_object(queryObjects.Body);
	var text = data.GetOptProperty('text');

	// create new
	if (commentId == undefined) {
		try {
			var parentId = data.GetOptProperty('parent_comment_id');
			var ideaId = data.GetOptProperty('idea_id');
			var commentDoc = Comments.create(text, curUserID, userDoc.TopElem.fullname, parentId, ideaId);
			var userDoc = OpenDoc(UrlFromDocID(curUserID));
			return Utils.setSuccess(Utils.toJSObject(commentDoc.TopElem));
		} catch(e) {
			return Utils.setError(e);
		}
	}

	//update
	try {
		var likes = data.GetOptProperty('likes');
		var objUpdate = {
			text: text
		}

		if (likes != undefined) {
			objUpdate.likes = likes;
		}

		var commentDoc = Comments.update(commentId, objUpdate);
		return Utils.setSuccess(Utils.toJSObject(commentDoc.TopElem));
	} catch(e) {
		return Utils.setError(e);
	}
}

function delete_Comments(queryObjects) {
	var data = tools.read_object(queryObjects.Body);
	var commentId = data.GetOptProperty('id');

	if (commentId != undefined) {
		try {
			Comments.remove(commentId);
			return Utils.setSuccess();
		} catch(e) {
			return Utils.setError(e);
		}
	}

	return Utils.setError('Unknown parameters');
}

%>