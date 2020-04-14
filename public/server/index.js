<%

curUserID = 6711785032659205612; // me test
//curUserID = 6719948502038810952; // volkov test

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
	var search = queryObjects.HasProperty('search') ? queryObjects.search : '';
	var status = queryObjects.HasProperty('status') ? queryObjects.status : '';
	var page = queryObjects.HasProperty('page') ? OptInt(queryObjects.page) : 1;
	var pageSize = 2;

	var min = (page - 1) * pageSize;
	var max = min + pageSize;
	var topicsObj = {};

	try {
		topicsObj = Topics.list(topicId, curUserID, search, status, min, max, pageSize);
	} catch(e) {
		return Utils.setError(e);
	}

	return Utils.setSuccess(topicsObj);
}

function post_TopicsArchive(queryObjects) {
	var data = tools.read_object(queryObjects.Body);
	var topicId = data.GetOptProperty('id');
	var isArchive = data.GetOptProperty('is_archive');

	if (topicId != undefined) {
		if (isArchive) {
			//alert('test:' + Topics.isAccessToActivate(topicId, curUserID));
			if (!Topics.isAccessToUpdate(topicId, curUserID)) {
				return Utils.setError('У вас нет прав на редактирование_');
			}
		} else {
			if (!Topics.isAccessToActivate(topicId, curUserID)) {
				//alert('post_TopicsArchive: 2');
				return Utils.setError('У вас нет прав на редактирование');
			}
		}

		if (isArchive != undefined) {
			var topic = Topics.archive(topicId, curUserID, isArchive);
			return Utils.setSuccess(topic);
		}
	}

	return Utils.setError('Topic ID not defined');
}

function post_TopicsRate(queryObjects) {
	var data = tools.read_object(queryObjects.Body);
	var topicId = data.GetOptProperty('id');
	var value = data.GetOptProperty('value');

	if (topicId != undefined && value != undefined) {
		if (Topics.isAccessToRate(topicId)) {
			var topic = Topics.rate(topicId, curUserID, value);
			return Utils.setSuccess(topic);
		} else {
			return Utils.setError('Нет доступа');
		}
	}

	return Utils.setError('Topic ID or value not defined');
}

function post_Topics(queryObjects) {
	var topicId = queryObjects.GetOptProperty('id');

	//var data = queryObjects.Request.Form;
	//alert(tools.object_to_text(data, 'json'));
	var data = tools.read_object(queryObjects.Body);
	var title = data.GetOptProperty('title');
	var description = data.GetOptProperty('description'); //data.GetOptProperty('description');
	var imageId = data.GetOptProperty('image_id');
	var file = data.GetOptProperty('file'); //data.GetOptProperty('file');
	var resId = null;

	if (title == undefined || description == undefined) {
		return Utils.setError('Unknown arguments');
	}

	// create new
	if (topicId == undefined) {
		try {
			if (!Topics.isAccessToAdd(curUserID)) {
				return Utils.setError('У вас нет прав на создание');
			}

			var userDoc = OpenDoc(UrlFromDocID(curUserID));

			/*if (file != undefined) {
				var resDoc = Utils.createResourseWithImage(curUserID, String(userDoc.TopElem.fullname), file.FileName, file);
				resId = resDoc.DocID;
			}*/
			resId = file != undefined ? file.id : null;

			var topicDoc = Topics.create(title, description, resId, curUserID, userDoc.TopElem.fullname);
			return Utils.setSuccess(topicDoc);
		} catch(e) {
			return Utils.setError(e);
		}
	}

	//update
	try {
		if (!Topics.isAccessToUpdate(topicId, curUserID)) {
			return Utils.setError('У вас нет прав на редактирование');
		}

		//if (file != undefined) {
			//удаляем старый файл
			/*var curDoc = OpenDoc(UrlFromDocID(Int(topicId)));
			DeleteDoc(UrlFromDocID(Int(curDoc.TopElem.image_id)));*/
		//	DeleteDoc(UrlFromDocID(Int(file.id)))

			//созлаем новый
			//var userDoc = OpenDoc(UrlFromDocID(curUserID));
		//	resId = file != undefined ? file.id : null;

			/*var resDoc = Utils.createResourseWithImage(curUserID, String(userDoc.TopElem.fullname), file.fileName, file.fileType, file);
			resId = resDoc.DocID;*/
		//}

		//alert('update topic: 1');
		var topicDoc = Topics.update(topicId, data, curUserID);
		//alert('update topic: 2');
		return Utils.setSuccess(topicDoc);
	} catch(e) {
		return Utils.setError(e);
	}
}

function delete_Topics(queryObjects) {
	var data = tools.read_object(queryObjects.Body);
	var topicId = data.GetOptProperty('id');

	if (topicId != undefined) {
		try {
			if (!Topics.isAccessToRemove(topicId, curUserID)) {
				return Utils.setError('У вас нет прав на удаление');
			}

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
		ideas = Ideas.list(ideaId, topicId, curUserID);
	} catch(e) {
		return Utils.setError(e);
	}
	
	return Utils.setSuccess(ideas);
}

function post_IdeasRate(queryObjects) {
	var data = tools.read_object(queryObjects.Body);
	var ideaId = data.GetOptProperty('id');
	var value = data.GetOptProperty('value');

	if (ideaId != undefined && value != undefined) {
		if (Ideas.isAccessToRate(ideaId)) {
			var idea = Ideas.rate(ideaId, curUserID, value);
			return Utils.setSuccess(idea);
		} else {
			Utils.setError('Нет доступа');
		}
	}

	return Utils.setError('Idea ID or value not defined');
}


function post_Ideas(queryObjects) {
	var ideaId = queryObjects.GetOptProperty('id');

	//var data = queryObjects.Request.Form;
	var data = tools.read_object(queryObjects.Body);
	var title = data.GetOptProperty('title');
	var description = data.GetOptProperty('description');
	var file = data.GetOptProperty('file');
	var topicId = data.GetOptProperty('topic_id');
	var resId = null;

	// create new
	if (ideaId == undefined) {
		try {
			if (!Ideas.isAccessToAdd(topicId)) {
				return Utils.setError('У вас нет прав на создание');
			}

			var userDoc = OpenDoc(UrlFromDocID(curUserID));
			
			if (file != undefined) {
				var resDoc = Utils.createResourseWithImage(curUserID, String(userDoc.TopElem.fullname), file.FileName, file);
				resId = resDoc.DocID;
			}

			//alert('index_postIdeas: 1');
			var topicDoc = OpenDoc(UrlFromDocID(Int(topicId)));
			//alert('index_postIdeas: 2');
			var ideaDoc = Ideas.create(title, description, resId, curUserID, userDoc.TopElem.fullname, topicId, topicDoc.TopElem.title);
			//alert('index_postIdeas: 3');
			return Utils.setSuccess(ideaDoc);
		} catch(e) {
			return Utils.setError(e);
		}
	}

	//update
	try {
		if (!Ideas.isAccessToUpdate(ideaId, curUserID)) {
			return Utils.setError('У вас нет прав на редактирование');
		}

		if (file != undefined) {
			//удаляем старый файл
			var curDoc = OpenDoc(UrlFromDocID(Int(ideaId)));
			DeleteDoc(UrlFromDocID(Int(curDoc.TopElem.image_id)))

			//созлаем новый
			var userDoc = OpenDoc(UrlFromDocID(curUserID));
			var resDoc = Utils.createResourseWithImage(curUserID, String(userDoc.TopElem.fullname), file.fileName, file.fileType, file);
			resId = resDoc.DocID;
		}

		//alert('update: 1');
		var ideaDoc = Ideas.update(ideaId, {
			title: title,
			description: description,
			image_id: resId
		}, curUserID);
		//alert('update: 2');
		return Utils.setSuccess(ideaDoc);
	} catch(e) {
		return Utils.setError(e);
	}
}

function delete_Ideas(queryObjects) {
	var data = tools.read_object(queryObjects.Body);
	var ideaId = data.GetOptProperty('id');

	if (ideaId != undefined) {
		try {

			if (!Ideas.isAccessToRemove(ideaId, curUserID)) {
				return Utils.setError('У вас нет прав на удаление');
			}

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
		comments = Comments.list(parentId, ideaId, curUserID);
	} catch(e) {
		return Utils.setError(e);
	}
	
	return Utils.setSuccess(comments);
}

function post_CommentsLike(queryObjects) {
	var data = tools.read_object(queryObjects.Body);
	var commentId = data.GetOptProperty('id');

	if (commentId != undefined) {
		if (Comments.isAccessToLike(commentId)) {
			var comment = Comments.like(commentId, curUserID);
			return Utils.setSuccess(comment);
		} else {
			return Utils.setError('Невозможно "лайкнуть" комментарий, т.к. он в архиве');
		}
	}

	return Utils.setError('Comment ID not defined');
}

function post_Comments(queryObjects) {
	var commentId = queryObjects.GetOptProperty('id');

	var data = tools.read_object(queryObjects.Body);
	var text = data.GetOptProperty('text');

	// create new
	if (commentId == undefined) {
		try {
			var parentId = data.GetOptProperty('parent_id');
			var ideaId = data.GetOptProperty('idea_id');

			if (ideaId == undefined){
				return Utils.setError('IdeaId not found');
			}

			if (!Comments.isAccessToAdd(ideaId)) {
				return Utils.setError('У вас нет прав на создание');
			}
			
			var userDoc = OpenDoc(UrlFromDocID(curUserID));
			var commentDoc = Comments.create(text, curUserID, userDoc.TopElem.fullname, parentId, ideaId);
			return Utils.setSuccess(commentDoc);
		} catch(e) {
			return Utils.setError(e);
		}
	}

	//update
	try {
		if (!Comments.isAccessToUpdate(commentId, curUserID)) {
			return Utils.setError('У вас нет прав на редактирование');
		}

		var objUpdate = {
			text: text
		}

		var commentDoc = Comments.update(commentId, objUpdate, curUserID);
		return Utils.setSuccess(commentDoc);
	} catch(e) {
		return Utils.setError(e);
	}
}

function delete_Comments(queryObjects) {
	var data = tools.read_object(queryObjects.Body);
	var commentId = data.GetOptProperty('id');

	if (commentId != undefined) {
		try {
			if (!Comments.isAccessToRemove(commentId, curUserID)) {
				return Utils.setError('У вас нет прав на удаление');
			}

			var deletedIds = Comments.remove(commentId);
			return Utils.setSuccess(deletedIds);
		} catch(e) {
			return Utils.setError(e);
		}
	}

	return Utils.setError('Unknown parameters');
}

function post_File(queryObjects) {
	var data = queryObjects.Request.Form;
	var file = data.GetOptProperty('file');

	if (file == undefined) {
		return Utils.setError('Unknown parameters');
	}

	var userDoc = OpenDoc(UrlFromDocID(curUserID));
	var resDoc = Utils.createResourseWithImage(curUserID, userDoc.TopElem.fullname, file.FileName, file);

	return Utils.setSuccess(Utils.toJSObject(resDoc.TopElem));
}

function delete_File(queryObjects) {
	var data = tools.read_object(queryObjects.Body);
	var resId = data.GetOptProperty('id');

	if (resId != undefined) {
		try {
			DeleteDoc(UrlFromDocID(Int(resId)));
			return Utils.setSuccess();
		} catch(e) {
			return Utils.setError(e);
		}
	}

	return Utils.setError('Unknown parameters');	
}

%>