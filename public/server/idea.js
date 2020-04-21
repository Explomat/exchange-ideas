function _toBoolean(val) {
	if (val == 'true') {
		return true;
	}

	if (val == true) {
		return true;
	}

	return false;
}

function _getModeratorActions(user_id) {
	var actions = [];

	var actionsq = XQuery("sql: \n\
		select ccia.action \n\
		from cc_exchange_ideas_roles ccir \n\
		inner join cc_exchange_ideas_moderators ccim on ccim.role_id = ccir.id \n\
		inner join cc_exchange_ideas_actions ccia on ccia.role_id = ccim.role_id \n\
		where \n\
			ccim.user_id = " + user_id + " \n\
			and ccia.object_type = 'cc_exchange_ideas_idea'");

	for (el in actionsq) {
		actions.push(String(el.action));
	}

	return actions;
}

function _setComputedFields(obj, user_id) {
	var l = ArrayOptFirstElem(XQuery("sql: \n\
		select \n\
			cceit.image_id topic_image_id \n\
		from cc_exchange_ideas_ideas cceii \n\
		inner join cc_exchange_ideas_topics cceit on cceit.id = cceii.topic_id \n\
		where cceii.id = " + obj.id)
	);

	var actions = _getModeratorActions(user_id);

	obj.publish_date = StrXmlDate(DateNewTime(Date(obj.publish_date)));
	obj.is_archive = _toBoolean(obj.is_archive);
	obj.topic_image_id = (l != undefined ? String(l.topic_image_id) : '');

	obj.meta = {
		isRated: obj.is_archive,
		canEdit: (
			(Int(obj.author_id) == Int(user_id) || (ArrayOptFind(actions, "This == 'update'") != undefined)) && !obj.is_archive
		),
		canDelete: (
			(Int(obj.author_id) == Int(user_id) || (ArrayOptFind(actions, "This == 'remove'") != undefined)) && !obj.is_archive
		)
	}
	return obj;
}

function create(title, description, image_id, author_id, author_fullname, topic_id, topic_title) {
	var Utils = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');
	DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');

	var ideaDoc = tools.new_doc_by_name('cc_exchange_ideas_idea');
	ideaDoc.TopElem.title = title;
	ideaDoc.TopElem.description = description;
	ideaDoc.TopElem.image_id = image_id;
	ideaDoc.TopElem.rate = 0;
	ideaDoc.TopElem.publish_date = new Date();
	ideaDoc.TopElem.author_id = author_id;
	ideaDoc.TopElem.author_fullname = author_fullname;
	ideaDoc.TopElem.topic_id = topic_id;
	ideaDoc.TopElem.topic_title = topic_title;
	ideaDoc.TopElem.is_archive = false;

	ideaDoc.BindToDb();
	ideaDoc.Save();
	return _setComputedFields(Utils.toJSObject(ideaDoc.TopElem), author_id);
}

function update(id, data, user_id) {
	var Utils = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');
	DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');

	var ideaDoc = null;

	try {
		ideaDoc = OpenDoc(UrlFromDocID(Int(id)));
	} catch(e) {
		throw 'Невозможно обновить документ. Ошибка: ' + e;
	}

	for (el in data) {
		try {
			field = ideaDoc.TopElem.OptChild(el);
			field.Value = data[el];
		} catch(e) {}
	}

	ideaDoc.Save();
	return _setComputedFields(Utils.toJSObject(ideaDoc.TopElem), user_id);
}

function remove(id) {
	var Comments = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/comment.js');
	DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/comment.js');

	var qcomments = XQuery("sql: \n\
		select id \n\
		from \n\
			cc_exchange_ideas_comments \n\
		where idea_id = " + id);

	for (elc in qcomments) {
		try {
			Comments.remove(elc.id);
		} catch(e) {}
	}

	var ideaDoc = OpenDoc(UrlFromDocID(Int(id)));
	var resId = ideaDoc.TopElem.image_id;
	if (resId != null && resId != undefined && resId != '') {
		DeleteDoc(UrlFromDocID(resId));
	}
	DeleteDoc(UrlFromDocID(Int(id)));
}

function list(id, topic_id, user_id) {
	var Utils = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');
	DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');

	if (id != undefined) {
		var el = ArrayOptFirstElem(XQuery("sql: \n\
			select \n\
				cceii.* \n\
			from \n\
				cc_exchange_ideas_ideas cceii \n\
			where \n\
				cceii.id = " + id)
		);
		return _setComputedFields(Utils.toJSObject(el), user_id);

	} else if (topic_id != undefined) {
		var l = XQuery("sql: \n\
			select \n\
				cceii.*, \n\
				(select count(id) from cc_exchange_ideas_comments where idea_id = cceii.id) comments_count \n\
			from \n\
				cc_exchange_ideas_ideas cceii \n\
			where \n\
				cceii.topic_id = " + topic_id);

		var larr = Utils.toJSArray(l);
		for (el in larr) {
			_setComputedFields(el, user_id);
		}

		var topicDoc = OpenDoc(UrlFromDocID(Int(topic_id)));
		return {
			ideas: larr,
			meta: {
				canAdd: !topicDoc.TopElem.is_archive
			}
		}
	}
}

function rate(id, user_id, value) {
	var Utils = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');
	DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');

	function getRate() {
		return ArrayOptFirstElem(XQuery("sql: \n\
			select isnull(sum([value]), 0) rate_sum, isnull(count(id), 0) rate_count \n\
			from cc_exchange_ideas_ratings \n\
			where \n\
				object_type = 'cc_exchange_ideas_idea' \n\
				and object_id = " + id)
		);
	}

	var l = ArrayOptFirstElem(XQuery("sql: \n\
		select id, value \n\
		from cc_exchange_ideas_ratings \n\
		where \n\
			object_type = 'cc_exchange_ideas_idea' \n\
			and object_id = " + id + " \n\
			and user_id = " + user_id + " \n\
	"));

	if (l == undefined) {
		var rateDoc = tools.new_doc_by_name('cc_exchange_ideas_rating');
		rateDoc.TopElem.object_type = 'cc_exchange_ideas_idea';
		rateDoc.TopElem.object_id = id;
		rateDoc.TopElem.user_id = user_id;
		rateDoc.TopElem.value = value;
		rateDoc.BindToDb();
		rateDoc.Save();
	} else {
		var rateDoc = OpenDoc(UrlFromDocID(Int(l.id)));
		rateDoc.TopElem.value = value;
		rateDoc.Save();
	}

	var ideaDoc = OpenDoc(UrlFromDocID(Int(id)));
	var r = getRate();
	ideaDoc.TopElem.rate = Utils.computeRate(Int(r.rate_sum), Int(r.rate_count));
	ideaDoc.Save();

	return _setComputedFields(Utils.toJSObject(ideaDoc.TopElem), user_id);
}

function archive(id, user_id, is_archive) {
	var Comments = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/comment.js');
	DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/comment.js');

	var Utils = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');
	DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');

	var qcomments = XQuery("sql: \n\
		select id \n\
		from \n\
			cc_exchange_ideas_comments \n\
		where idea_id = " + id);

	for (elc in qcomments) {
		try {
			Comments.archive(elc.id, user_id, is_archive);
		} catch(e) {}
	}

	var ideaDoc = OpenDoc(UrlFromDocID(Int(id)));
	ideaDoc.TopElem.is_archive = is_archive;
	ideaDoc.Save();

	return _setComputedFields(Utils.toJSObject(ideaDoc.TopElem), user_id);
}

function isAccessToRate(id) {
	var ideaDoc = OpenDoc(UrlFromDocID(Int(id)));
	return !ideaDoc.TopElem.is_archive;
}

function isAccessToUpdate(id, user_id) {
	var actions = _getModeratorActions(user_id);
	var updateAction = ArrayOptFind(actions, "This == 'update'");
	var ideaDoc = OpenDoc(UrlFromDocID(Int(id)));
	return ((updateAction != undefined || Int(ideaDoc.TopElem.author_id) == Int(user_id)) && !ideaDoc.TopElem.is_archive);
}

function isAccessToRemove(id, user_id) {
	var actions = _getModeratorActions(user_id);
	var removeAction = ArrayOptFind(actions, "This == 'remove'");
	var ideaDoc = OpenDoc(UrlFromDocID(Int(id)));
	return ((removeAction != undefined || Int(ideaDoc.TopElem.author_id) == Int(user_id)) && !ideaDoc.TopElem.is_archive);
}

function isAccessToAdd(topic_id) {
	/*var actions = _getModeratorActions(user_id);
	var addAction = ArrayOptFind(actions, "This == 'add'");
	return (addAction != undefined);*/
	var topicDoc = OpenDoc(UrlFromDocID(Int(topic_id)));
	return !topicDoc.TopElem.is_archive;
}