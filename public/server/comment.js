function create(text, author_id, author_fullname, parent_comment_id, idea_id) {
	var commentDoc = tools.new_doc_by_name('cc_exchange_ideas_comment');
	commentDoc.TopElem.text = text;
	commentDoc.TopElem.author_id = author_id;
	commentDoc.TopElem.author_fullname = author_fullname;
	commentDoc.TopElem.publish_date = new Date();
	commentDoc.TopElem.likes = 0;
	commentDoc.TopElem.parent_comment_id = parent_comment_id;
	commentDoc.TopElem.idea_id = idea_id;
	return commentDoc;
}

function update(comment_id, data) {
	var commentDoc = null;

	try {
		commentDoc = OpenDoc(UrlFromDocID(Int(comment_id)));
		//alert(tools.object_to_text(commentDoc, 'json'));
		//alert('update_0');
	} catch(e) {
		throw 'Невозможно обновить документ. Ошибка: ' + e;
	}

	//alert('update_1');

	for (el in data) {
		//alert('update_2');
		try {
			field = commentDoc.TopElem.OptChild(el);
			field.Value = data[el];
		} catch(e) { alert(e) }
	}

	commentDoc.Save();
	return commentDoc;
}

function remove(comment_id) {
	DeleteDoc(UrlFromDocID(Int(comment_id)));
}

function list(parent_id, idea_id) {

	if (parent_id != undefined) {
		return XQuery("sql: \n\
			select \n\
				cceic.* \n\
			from \n\
				cc_exchange_ideas_comments cceic \n\
			where \n\
				cceic.parent_comment_id = " + parent_id
		);
		
	} else if (idea_id != undefined) {
		return XQuery("sql: \n\
			select \n\
				cceic.* \n\
			from \n\
				cc_exchange_ideas_comments cceic \n\
			where \n\
				cceic.idea_id = " + idea_id
		);
	}
}