function create(title, description, image_id, author_id, author_fullname) {
	var topicDoc = tools.new_doc_by_name('cc_exchange_ideas_topic');
	topicDoc.TopElem.title = title;
	topicDoc.TopElem.description = description;
	topicDoc.TopElem.image_id = image_id;
	topicDoc.TopElem.rate = null;
	topicDoc.TopElem.publish_date = new Date();
	topicDoc.TopElem.author_id = author_id;
	topicDoc.TopElem.author_fullname = author_fullname;
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
			field = topicDoc.OptChild(el);
			field.Value = data[el];
		} catch(e) {}
	}

	topicDoc.Save();
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
				cs.fullname author_fullname, \n\
				cceit.* \n\
			from \n\
				cc_exchange_ideas_topics cceit \n\
			left join collaborators cs on cs.id = cceit.author_id \n\
		")
	}

	return ArrayOptFirstElem(
		XQuery("sql: \n\
		select \n\
			cs.fullname author_fullname, \n\
			cceit.* \n\
		from \n\
			cc_exchange_ideas_topics cceit \n\
		left join collaborators cs on cs.id = cceit.author_id \n\
		where \n\
			cceit.id = " + id)
	);
}