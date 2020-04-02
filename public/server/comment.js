function _setComputedFields(obj, user_id) {
	var l = ArrayOptFirstElem(XQuery("sql: \n\
		select id \n\
		from cc_exchange_ideas_likes \n\
		where \n\
			object_type = 'cc_exchange_ideas_comment' \n\
			and object_id = " + obj.id + " \n\
			and user_id = " + user_id + " \n\
	"));

	obj.meta = {
		isLiked: (l != undefined),
		canEdit: (Int(obj.author_id) == Int(user_id)),
		canDelete: (Int(obj.author_id) == Int(user_id))
	}

	//obj.isLiked = (l != undefined) ? 1 : 0;
	return obj;
}

function create(text, author_id, author_fullname, parent_id, idea_id) {
	var Utils = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');
	DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');

	var commentDoc = tools.new_doc_by_name('cc_exchange_ideas_comment');
	commentDoc.TopElem.text = text;

	commentDoc.TopElem.author_id = author_id;
	commentDoc.TopElem.author_fullname = author_fullname;
	commentDoc.TopElem.publish_date = new Date();
	commentDoc.TopElem.likes = 0;

	if (parent_id != undefined) {
		commentDoc.TopElem.parent_id = parent_id;
	}
	
	commentDoc.TopElem.idea_id = idea_id;
	commentDoc.BindToDb();
	commentDoc.Save();
	return _setComputedFields(Utils.toJSObject(commentDoc.TopElem), author_id);
}

function update(comment_id, data, user_id) {
	var Utils = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');
	DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');

	var commentDoc = null;

	try {
		commentDoc = OpenDoc(UrlFromDocID(Int(comment_id)));
	} catch(e) {
		throw 'Невозможно обновить документ. Ошибка: ' + e;
	}

	for (el in data) {
		try {
			field = commentDoc.TopElem.OptChild(el);
			field.Value = data[el];
		} catch(e) { alert(e) }
	}

	commentDoc.Save();
	return _setComputedFields(Utils.toJSObject(commentDoc.TopElem), user_id);
}

function remove(comment_id) {

	var deletedIds = [];

	function getChilds(parent_id) {
		return XQuery("sql: \n\
			select id \n\
			from cc_exchange_ideas_comments \n\
			where parent_id = " + parent_id
		);
	}

	function removeChilds(id) {
		childComments = getChilds(id);
		
		if (ArrayCount(childComments) > 0) {
			for (el in childComments) {
				removeChilds(el.id);
			}
		}

		DeleteDoc(UrlFromDocID(Int(id)));
		deletedIds.push(Int(id));
	}

	removeChilds(comment_id);

	return deletedIds;
}

function list(parent_id, idea_id, user_id) {
	var Utils = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');
	DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');

	if (parent_id != undefined) {
		var l = XQuery("sql: \n\
			select \n\
				cceic.* \n\
			from \n\
				cc_exchange_ideas_comments cceic \n\
			where \n\
				cceic.parent_comment_id = " + parent_id
		);

		var larr = Utils.toJSArray(l);
		for (el in larr) {
			_setComputedFields(el, user_id);
		}
		return larr;
		
	} else if (idea_id != undefined) {
		var l = XQuery("sql: \n\
			select \n\
				cceic.* \n\
			from \n\
				cc_exchange_ideas_comments cceic \n\
			where \n\
				cceic.idea_id = " + idea_id
		);
		var larr = Utils.toJSArray(l);
		for (el in larr) {
			_setComputedFields(el, user_id);
		}
		return larr;
	}
}

function like(comment_id, user_id) {
	var Utils = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');
	DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');

	var l = ArrayOptFirstElem(XQuery("sql: \n\
		select id \n\
		from cc_exchange_ideas_likes \n\
		where \n\
			object_type = 'cc_exchange_ideas_comment' \n\
			and object_id = " + comment_id + " \n\
			and user_id = " + user_id + " \n\
	"));

	if (l == undefined) {
		var likeDoc = tools.new_doc_by_name('cc_exchange_ideas_like');
		likeDoc.TopElem.object_type = 'cc_exchange_ideas_comment';
		likeDoc.TopElem.object_id = comment_id;
		likeDoc.TopElem.user_id = user_id;
		likeDoc.BindToDb();
		likeDoc.Save();

		var commentDoc = OpenDoc(UrlFromDocID(Int(comment_id)));
		commentDoc.TopElem.likes = commentDoc.TopElem.likes + 1;
		commentDoc.Save();
		return _setComputedFields(Utils.toJSObject(commentDoc.TopElem), user_id);
	}

	DeleteDoc(UrlFromDocID(Int(l.id)));

	var commentDoc = OpenDoc(UrlFromDocID(Int(comment_id)));
	commentDoc.TopElem.likes = commentDoc.TopElem.likes - 1;
	commentDoc.Save();

	return _setComputedFields(Utils.toJSObject(commentDoc.TopElem), user_id);
}