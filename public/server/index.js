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
	var topics = [];

	try {
		topics = Topics.list(topicId, curUserID);
	} catch(e) {
		return Utils.setError(e);
	}
	
	return Utils.setSuccess(topics);
}

function post_TopicsRate(queryObjects) {
	var data = tools.read_object(queryObjects.Body);
	var topicId = data.GetOptProperty('id');
	var value = data.GetOptProperty('value');

	if (topicId != undefined && value != undefined) {
		var topic = Topics.rate(topicId, curUserID, value);
		return Utils.setSuccess(topic);
	}

	return Utils.setError('Topic ID or value not defined');
}

function post_Topics(queryObjects) {
	var topicId = queryObjects.GetOptProperty('id');

	//var data = queryObjects.Request.Form;
	var data = tools.read_object(queryObjects.Body);
	var title = data.GetOptProperty('title');
	var description = data.GetOptProperty('description');
	var file = data.GetOptProperty('file');
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
			return Utils.setSuccess(topicDoc);
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

		//alert('update topic: 1');
		var topicDoc = Topics.update(topicId, {
			title: title,
			description: description,
			image_id: resId
		}, curUserID);
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
		var idea = Ideas.rate(ideaId, curUserID, value);
		return Utils.setSuccess(idea);
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
			var userDoc = OpenDoc(UrlFromDocID(curUserID));

			if (file != undefined) {
				var resDoc = Utils.createResourseWithImage(curUserID, String(userDoc.TopElem.fullname), file.fileName, file.fileType, file);
				resId = resDoc.DocID;
			}

			var topicDoc = OpenDoc(UrlFromDocID(Int(topicId)));
			var ideaDoc = Ideas.create(title, description, resId, curUserID, userDoc.TopElem.fullname, topicId, topicDoc.TopElem.title);
			return Utils.setSuccess(ideaDoc);
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
	
	return Utils.setSuccess({
		comments: comments
		//tree: commentsTree
	});
}

function post_CommentsLike(queryObjects) {
	var data = tools.read_object(queryObjects.Body);
	var commentId = data.GetOptProperty('id');

	if (commentId != undefined) {
		var comment = Comments.like(commentId, curUserID);
		return Utils.setSuccess(comment);
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
			var userDoc = OpenDoc(UrlFromDocID(curUserID));
			var commentDoc = Comments.create(text, curUserID, userDoc.TopElem.fullname, parentId, ideaId);
			return Utils.setSuccess(commentDoc);
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
			var deletedIds = Comments.remove(commentId);
			return Utils.setSuccess(deletedIds);
		} catch(e) {
			return Utils.setError(e);
		}
	}

	return Utils.setError('Unknown parameters');
}

%>