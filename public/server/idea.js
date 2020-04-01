function create(title, description, image_id, author_id, author_fullname, topic_id, topic_title) {
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

	ideaDoc.BindToDb();
	ideaDoc.Save();
	return ideaDoc;
}

function update(id, data) {
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
	return ideaDoc;
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
	
	DeleteDoc(UrlFromDocID(Int(id)));
}

function list(id, topic_id) {
	if (id != undefined) {
		return ArrayOptFirstElem(XQuery("sql: \n\
			select \n\
				cceii.* \n\
			from \n\
				cc_exchange_ideas_ideas cceii \n\
			where \n\
				cceii.id = " + id)
		);
		
	} else if (topic_id != undefined) {
		return XQuery("sql: \n\
			select \n\
				cceii.*, \n\
				(select count(id) from cc_exchange_ideas_comments where idea_id = cceii.id) comments_count \n\
			from \n\
				cc_exchange_ideas_ideas cceii \n\
			where \n\
				cceii.topic_id = " + topic_id);
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
		"));
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
	return ideaDoc;
}