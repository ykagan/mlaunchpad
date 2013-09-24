'use strict';

angular.module('cgAngularApp')
  .factory('Container', function Container() {
        return  {
            Getcontainer: function(container, subcontainer, toc){
                if(subcontainer == "PX_MULTIPART_LESSONS")
                {
                    return [
                        {
                            Id: "CHAPTER1_ID",
                            Title: "Chapter 1",
                            Description: "This is chapter 1",
                            ImageUrl: "/img/chapter.png",
                            Toc: "syllabusfilter",
                            Container: "Launchpad",
                            Subcontainer: "PX_MULTIPART_LESSONS",
                            Parent: "PX_MULTIPART_LESSONS",
                            Sequence: "a",
                            Level: 1,
                            Children: []
                        },
                        {
                            Id: "CHAPTER1_ID",
                            Title: "Chapter 2",
                            Description: "This is chapter 2",
                            ImageUrl: "/img/chapter.png",
                            Toc: "syllabusfilter",
                            Container: "Launchpad",
                            Subcontainer: "PX_MULTIPART_LESSONS",
                            Parent: "PX_MULTIPART_LESSONS",
                            Sequence: "a",
                            Level: 1,
                            Children: []
                        },
                        {
                            Id: "CHAPTER1_ID",
                            Title: "Chapter 3",
                            Description: "This is chapter 3",
                            ImageUrl: "/img/chapter.png",
                            Toc: "syllabusfilter",
                            Container: "Launchpad",
                            Subcontainer: "PX_MULTIPART_LESSONS",
                            Parent: "PX_MULTIPART_LESSONS",
                            Sequence: "a",
                            Level: 1,
                            Children: []
                        }
                    ];

                }
                else {
                    return [
                        {
                            Id: "CHAPTER1_1",
                            Title: "Section 1",
                            Type: "PxUnit",
                            Toc: toc,
                            Container: container,
                            Subcontainer: subcontainer,
                            Parent: "CHAPTER1_ID",
                            Sequence: "a",
                            Level: 2
                        },
                        {
                            Id: "CHAPTER1_1_2",
                            Title: "Section 1.1",
                            Type: "ExternalContent",
                            Toc: toc,
                            Container: container,
                            Subcontainer: subcontainer,
                            Parent: "CHAPTER1_1",
                            Sequence: "a",
                            Level: 3
                        },
                        {
                            Id: "CHAPTER1_2",
                            Title: "Section 2",
                            Type: "PxUnit",
                            Toc: toc,
                            Container: container,
                            Subcontainer: subcontainer,
                            Parent: "CHAPTER1_ID",
                            Sequence: "a",
                            Level: 2
                        }
                    ];
                }
            }
        }
    });
