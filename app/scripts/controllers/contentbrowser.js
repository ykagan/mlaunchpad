'use strict';

angular.module('cgAngularApp')
  .controller('ContentbrowserCtrl', function ($scope, Container) {
        $scope.rootItems = function()
        {
            var rootItems = Container.Getcontainer("Launchpad", "PX_MULTIPART_LESSONS", "syllabusfilter");

            //scan items
            angular.forEach(rootItems, function(value, key)
            {
                value.State = 'closed';
            });
            return rootItems;
        }();

        $scope.toggleChapter = function(item)
        {
            if(item.State === 'closed')
            {

                var children = Container.Getcontainer(item.Container, item.Id, item.toc);

                //scan children
                angular.forEach(children, function(child, key)
                {
                    if(child.Level > 2)
                    {
                        child.isVisible = false;
                    }
                    else
                    {
                        child.isVisible = true;
                    }
                    if(child.Type == "PxUnit")
                    {
                        child.State = 'closed';
                    }
                    child.ParentContainer = item;
                });
                item.Children = children;

                //close all root items
                angular.forEach($scope.rootItems, function(value, key)
                {
                    value.State = 'closed';
                });
                item.State = 'open';
            }
            else
            {
                item.State = 'closed';

            }
        };

        $scope.toggleNode = function(item)
        {
	        var allChildren = item.ParentContainer.Children;
            if(item.State == "closed")
            {
                angular.forEach(allChildren, function(value,key)
                {
                    if(value.Parent == item.Id)
                    {
                        value.isVisible = true;
                    }
                });
                item.State = 'open';
            }
            else
            {
                angular.forEach(allChildren, function(value,key)
                {
                    if(value.Parent == item.Id)
                    {
                        value.isVisible = false;
                    }
                });
                item.State = 'closed';
            }
        }
  });
