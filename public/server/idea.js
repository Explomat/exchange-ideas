function create(title, description, image_id, author_id, author_fullname, topic_id, topic_title) {
	var ideaDoc = tools.new_doc_by_name('cc_exchange_ideas_idea');
	ideaDoc.TopElem.title = title;
	ideaDoc.TopElem.description = description;
	ideaDoc.TopElem.image_id = image_id;
	ideaDoc.TopElem.rate = null;
	ideaDoc.TopElem.publish_date = new Date();
	ideaDoc.TopElem.author_id = author_id;
	ideaDoc.TopElem.author_fullname = author_fullname;
	ideaDoc.TopElem.topic_id = topic_id;
	ideaDoc.TopElem.topic_title = topic_title;
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
			field = ideaDoc.OptChild(el);
			field.Value = data[el];
		} catch(e) {}
	}

	ideaDoc.Save();
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
				cceii.* \n\
			from \n\
				cc_exchange_ideas_ideas cceii \n\
			where \n\
				cceii.topic_id = " + topic_id);
	}
}