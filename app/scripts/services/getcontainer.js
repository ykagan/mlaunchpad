'use strict';

angular.module('cgAngularApp')
  .factory('Container', function Container() {

		var item1 = {
			Id: "ITEM1_ID",
			Title: "Content Item 1",
			Description: "this is a content item",
			ImageUrl: "",
			Url: "content/introduction.htm",
			Toc: "syllabusfilter",
			Container: "Launchpad",
			Subcontainer: "PX_MULTIPART_LESSONS",
			Parent: "PX_MULTIPART_LESSONS",
			Sequence: "a",
			Children: [],
			Level: 1,
			CanHaveChildren: false
		};
		var item2 = {
			Id: "section1_1",
			Title: "Section 1.1",
			Type: "ExternalContent",
			Url: "content/introduction.htm",
			Toc: "syllabusfilter",
			Container: "Launchpad",
			Subcontainer: "CHAPTER1_ID",
			Parent: "CHAPTER1_1",
			Sequence: "a",
			Children: [],
			Level: 3,
			CanHaveChildren: false
		};
		var chapter1 = {
			Id: "CHAPTER1_ID",
			Title: "Chapter 1",
			Description: "This is chapter 1",
			ImageUrl: "/images/chapter.png",
			Toc: "syllabusfilter",
			Container: "Launchpad",
			Subcontainer: "PX_MULTIPART_LESSONS",
			Parent: "PX_MULTIPART_LESSONS",
			Sequence: "a",
			Level: 1,
			Children: [],
			CanHaveChildren: true
		};
		var chapter1_1 = {
			Id: "CHAPTER1_1",
			Title: "Section 1",
			Type: "PxUnit",
			Toc: "syllabusfilter",
			Container: "Launchpad",
			Subcontainer: "CHAPTER1_ID",
			Parent: "CHAPTER1_ID",
			Sequence: "a",
			Level: 2,
			CanHaveChildren: true
		};
		return  {
            Getcontainer: function(container, subcontainer, toc){
                if(subcontainer == "PX_MULTIPART_LESSONS")
                {

                    return [
	                    chapter1,
	                   item1,
                        {
                            Id: "CHAPTER2_ID",
                            Title: "Chapter 2",
                            Description: "This is chapter 2",
                            ImageUrl: "/images/chapter.png",
                            Toc: "syllabusfilter",
                            Container: "Launchpad",
                            Subcontainer: "PX_MULTIPART_LESSONS",
                            Parent: "PX_MULTIPART_LESSONS",
                            Sequence: "a",
                            Level: 1,
                            Children: [],
	                        CanHaveChildren: true
                        },
                        {
                            Id: "CHAPTER3_ID",
                            Title: "Chapter 3",
                            Description: "This is chapter 3",
                            ImageUrl: "/images/chapter.png",
                            Toc: "syllabusfilter",
                            Container: "Launchpad",
                            Subcontainer: "PX_MULTIPART_LESSONS",
                            Parent: "PX_MULTIPART_LESSONS",
                            Sequence: "a",
                            Level: 1,
                            Children: [],
	                        CanHaveChildren: true
                        }
                    ];

                }
                else if(subcontainer == "CHAPTER1_ID"){
                    return [
                        chapter1_1,
                        item2,
                        {
                            Id: "CHAPTER1_2",
                            Title: "Section 2",
                            Type: "PxUnit",
                            Toc: toc,
                            Container: container,
                            Subcontainer: subcontainer,
                            Parent: "CHAPTER1_ID",
                            Sequence: "a",
                            Level: 2,
	                        CanHaveChildren: true
                        }
                    ];
                }
            },

	        GetItem: function(itemId)
	        {
		        if(itemId == 'ITEM1_ID')
		        {
			        return item1;
		        }
		        else if (itemId == "section1_1")
		        {
			      return item2;
		        }
		        else if(itemId =="CHAPTER1_ID")
		        {
			        return chapter1;
		        }
		        else if(itemId == "CHAPTER1_1")
		        {
			        return chapter1_1;
		        }
		        else
		        {
			        return null;
		        }
	        }
        }
    });
