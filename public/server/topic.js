function create(title, description, image_id, author_id, author_fullname) {
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
	return topicDoc;
}

function update(id, data) {
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
	return topicDoc;
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

	DeleteDoc(UrlFromDocID(Int(id)));
}

function list(id) {

	if (id == undefined) {
		return XQuery("sql: \n\
			select \n\
				cceit.*, \n\
				(select count(id) from cc_exchange_ideas_ideas where topic_id = cceit.id) ideas_count \n\
			from \n\
				cc_exchange_ideas_topics cceit \n\
		")
	}

	return ArrayOptFirstElem(
		XQuery("sql: \n\
		select \n\
			cceit.* \n\
		from \n\
			cc_exchange_ideas_topics cceit \n\
		where \n\
			cceit.id = " + id)
	);
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
		"));
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
	return topicDoc;
}