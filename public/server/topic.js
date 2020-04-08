function _getModeratorActions(user_id) {
	var actions = [];

	var actionsq = XQuery("sql: \n\
		select ccia.action \n\
		from cc_exchange_ideas_roles ccir \n\
		inner join cc_exchange_ideas_moderators ccim on ccim.role_id = ccir.id \n\
		inner join cc_exchange_ideas_actions ccia on ccia.moderator_id = ccim.id \n\
		where \n\
			ccim.user_id = " + user_id + " \n\
			and ccia.object_type = 'cc_exchange_ideas_topic'");

	for (el in actionsq) {
		actions.push(String(el.action));
	}

	return actions;
}

function _setComputedFields(obj, user_id) {
	var l = ArrayOptFirstElem(XQuery("sql: \n\
		select id \n\
		from cc_exchange_ideas_ratings \n\
		where \n\
			object_type = 'cc_exchange_ideas_topic' \n\
			and object_id = " + obj.id + " \n\
			and user_id = " + user_id + " \n\
	"));

	var actions = _getModeratorActions(user_id);

	obj.publish_date = StrXmlDate(DateNewTime(Date(obj.publish_date)));

	obj.meta = {
		isRated: (l != undefined),
		canEdit: (Int(obj.author_id) == Int(user_id)),
		canDelete: (Int(obj.author_id) == Int(user_id))
	}

	//obj.isRated = (l != undefined) ? 1 : 0;
	return obj;
}

function create(title, description, image_id, author_id, author_fullname) {
	var Utils = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');
	DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');

	var topicDoc = tools.new_doc_by_name('cc_exchange_ideas_topic');
	topicDoc.TopElem.title = title;
	topicDoc.TopElem.description = description;
	topicDoc.TopElem.image_id = image_id;
	topicDoc.TopElem.rate = 0;
	topicDoc.TopElem.publish_date = new Date();
	topicDoc.TopElem.author_id = author_id;
	topicDoc.TopElem.author_fullname = author_fullname;

	topicDoc.BindToDb();
	topicDoc.Save();
	return _setComputedFields(Utils.toJSObject(topicDoc.TopElem), author_id);
}

function update(id, data, user_id) {
	var Utils = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');
	DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');

	var topicDoc = null;

	try {
		topicDoc = OpenDoc(UrlFromDocID(Int(id)));
	} catch(e) {
		throw 'Невозможно обновить документ. Ошибка: ' + e;
	}

	for (el in data) {
		try {
			field = topicDoc.TopElem.OptChild(el);
			field.Value = data[el];
		} catch(e) {
			alert(e);
		}
	}

	topicDoc.Save();
	return _setComputedFields(Utils.toJSObject(topicDoc.TopElem), user_id);
}

function remove(id) {
	var Ideas = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/idea.js');
	DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/idea.js');

	var qideas = XQuery("sql: \n\
		select id \n\
		from \n\
			cc_exchange_ideas_ideas \n\
		where topic_id = " + id + " \n\
	");

	for (eli in qideas) {
		try {
			Ideas.remove(eli.id);
		} catch(e) {}
	}

	var topicDoc = OpenDoc(UrlFromDocID(Int(id)));
	var resId = topicDoc.TopElem.image_id;
	if (resId != null && resId != undefined) {
		DeleteDoc(UrlFromDocID(Int(resId)));
	}
	DeleteDoc(UrlFromDocID(Int(id)));
}

function list(id, user_id) {
	var Utils = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');
	DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');

	if (id == undefined) {
		var l = XQuery("sql: \n\
			select \n\
				cceit.*, \n\
				(select count(id) from cc_exchange_ideas_ideas where topic_id = cceit.id) ideas_count \n\
			from \n\
				cc_exchange_ideas_topics cceit \n\
		");

		var larr = Utils.toJSArray(l);
		for (el in larr) {
			_setComputedFields(el, user_id);
		}
		return larr;
	}

	var el = ArrayOptFirstElem(
		XQuery("sql: \n\
		select \n\
			cceit.* \n\
		from \n\
			cc_exchange_ideas_topics cceit \n\
		where \n\
			cceit.id = " + id)
	);

	return _setComputedFields(Utils.toJSObject(el), user_id);
}

function rate(id, user_id, value) {
	var Utils = OpenCodeLib('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');
	DropFormsCache('x-local://wt/web/vsk/portal/exchange-ideas/server/utils.js');

	function getRate() {
		return ArrayOptFirstElem(XQuery("sql: \n\
			select isnull(sum([value]), 0) rate_sum, isnull(count(id), 0) rate_count \n\
			from cc_exchange_ideas_ratings \n\
			where \n\
				object_type = 'cc_exchange_ideas_topic' \n\
				and object_id = " + id)
		);
	}

	var l = ArrayOptFirstElem(XQuery("sql: \n\
		select id, value \n\
		from cc_exchange_ideas_ratings \n\
		where \n\
			object_type = 'cc_exchange_ideas_topic' \n\
			and object_id = " + id + " \n\
			and user_id = " + user_id + " \n\
	"));

	if (l == undefined) {
		var rateDoc = tools.new_doc_by_name('cc_exchange_ideas_rating');
		rateDoc.TopElem.object_type = 'cc_exchange_ideas_topic';
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

	var topicDoc = OpenDoc(UrlFromDocID(Int(id)));
	var r = getRate();
	topicDoc.TopElem.rate = Utils.computeRate(Int(r.rate_sum), Int(r.rate_count));
	topicDoc.Save();
	return _setComputedFields(Utils.toJSObject(topicDoc.TopElem), user_id);
}

function isAccessToUpdate(user_id) {
	var actions = _getModeratorActions(user_id);
	var updateAction = ArrayOptFind(actions, "This == 'update'");
	return (updateAction != undefined);
}

function isAccessToRemove(user_id) {
	var actions = _getModeratorActions(user_id);
	var removeAction = ArrayOptFind(actions, "This == 'remove'");
	return (removeAction != undefined);
}

function isAccessToAdd(user_id) {
	var actions = _getModeratorActions(user_id);
	var addAction = ArrayOptFind(actions, "This == 'add'");
	return (addAction != undefined);
}