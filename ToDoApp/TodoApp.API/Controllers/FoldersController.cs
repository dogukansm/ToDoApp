using Couchbase;
using Couchbase.Search;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using TodoApp.API.Models;

namespace TodoApp.API.Controllers
{

    [ApiController]
    public class FoldersController : ControllerBase
    {
        [Route("api/[controller]/addfolder")]
        [HttpPost]
        public async Task<IActionResult> AddFolder([FromBody] Folders_Add request)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");
            var bucket = await cluster.BucketAsync("todoapp");
            var scope = await bucket.ScopeAsync("lists");
            var collection = await scope.CollectionAsync("folders");

            var info = TimeZoneInfo.FindSystemTimeZoneById("Turkey Standard Time");
            DateTimeOffset localServerTime = DateTimeOffset.Now;
            DateTimeOffset localTime = TimeZoneInfo.ConvertTime(localServerTime, info);

            await collection.UpsertAsync(Guid.NewGuid().ToString(), new Folders_Add
            {
                userid = request.userid,
                name = request.name,
                createddate = localTime
            });

            return Ok();
        }
        
        [Route("api/[controller]/updatefolder")]
        [HttpPost]
        public async Task<IActionResult> UpdateFolder([FromBody] Folders_Update request)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");
            var result = await cluster.QueryAsync<dynamic>(
                "UPDATE todoapp.lists.folders t SET name=$name Where meta(t).id=$id",
                options =>
                {
                    options.Parameter("id", request.id);
                    options.Parameter("name", request.name);
                }
            );

            return Ok();
        }

        [Route("api/[controller]/deletefolder")]
        [HttpPost]
        public async Task<IActionResult> DeleteFolder([FromBody] Folders_Delete request)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");
            var result = await cluster.QueryAsync<dynamic>(
                "DELETE FROM todoapp.lists.folders t Where meta(t).id=$id",
                options => options.Parameter("id", request.id));

            return Ok();
        }

        [Route("api/[controller]/additem")]
        public async Task<IActionResult> AddFolderItem([FromBody] FolderItems_Add request)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");
            var bucket = await cluster.BucketAsync("todoapp");
            var scope = await bucket.ScopeAsync("lists");
            var collection = await scope.CollectionAsync("folderitems");

            var info = TimeZoneInfo.FindSystemTimeZoneById("Turkey Standard Time");
            DateTimeOffset localServerTime = DateTimeOffset.Now;
            DateTimeOffset localTime = TimeZoneInfo.ConvertTime(localServerTime, info);

            await collection.UpsertAsync(Guid.NewGuid().ToString(), new FolderItems_Add
            {
                folderid = request.folderid,
                projectid = request.projectid,
                status = request.status,
                createddate = localTime
            });

            return Ok();
        }

        [HttpGet]
        [Route("api/[controller]/getfolders")]
        public async Task<IActionResult> GetFolders()
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");

            var result = await cluster.QueryAsync<dynamic>(
                "SELECT meta(t).id,t.* FROM todoapp.lists.folders t"
            );



            List<Folders> folders = new List<Folders>();

            int count = 0;
            await foreach (var row in result)
            {
                count++;
                folders.Add(new Folders
                {
                    id = row.id,
                    userid = row.userid,
                    name = row.name,
                    createddate = row.createddate
                });
            }

            if (count == 0)
            {
                return NotFound();
            }
            else
            {
                return Ok(folders);
            }
        }

        [HttpGet]
        [Route("api/[controller]/getfolders/{userid}")]
        public async Task<IActionResult> GetFolders(string userid)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");

            var result = await cluster.QueryAsync<dynamic>(
                "SELECT meta(t).id,t.* FROM todoapp.lists.folders t Where t.userid=$userid",
                options => options.Parameter("userid", userid)
            );

            List<Folders> folders = new List<Folders>();

            int count = 0;
            await foreach (var row in result)
            {
                count++;
                folders.Add(new Folders
                {
                    id = row.id,
                    userid = row.userid,
                    name = row.name,
                    createddate = row.createddate
                });
            }

            if (count == 0)
            {
                return NotFound();
            }
            else
            {
                return Ok(folders);
            }
        }

        [HttpGet]
        [Route("api/[controller]/getfolderitems/{folderid}")]
        public async Task<IActionResult> GetFolderItems(string folderid)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");

            var result = await cluster.QueryAsync<dynamic>(
                "SELECT meta(t).id,t.* FROM todoapp.lists.folderitems t Where t.folderid=$folderid",
                options => options.Parameter("folderid", folderid)
            );

            List<FolderItems> folderitems = new List<FolderItems>();

            int count = 0;

            await foreach (var row in result)
            {
                count++;
                folderitems.Add(new FolderItems
                {
                    id = row.id,
                    folderid = row.folderid,
                    projectid = row.projectid,
                    status = row.status,
                    createddate = row.createddate
                });
            }

            if (count == 0)
            {
                return NotFound();
            }
            else
            {
                return Ok(folderitems);
            }
        }

        [HttpGet]
        [Route("api/[controller]/getfolderprojects/{folderid}")]
        public async Task<IActionResult> GetFolderProjects(string folderid)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");

             var result = await cluster.QueryAsync<dynamic>(
                @"SELECT meta(Projects).id, Projects.*
                    FROM todoapp.lists.folderitems AS Items
                    INNER JOIN todoapp.lists.projects AS Projects
                    ON Items.projectid = meta(Projects).id
                    WHERE Items.folderid=$folderid",
                options => options.Parameter("folderid", folderid)
            );

            List<Projects> projects = new List<Projects>();
            int count = 0;

            await foreach (var row in result)
            {
                count++;
                projects.Add(new Projects
                {
                    id = row.id,
                    userid = row.userid,
                    name = row.name,
                    status = row.status,
                    createddate = row.createddate
                });
            }

            if (count == 0)
            {
                return NotFound();
            }
            else
            {
                return Ok(projects);
            }
        }
    }
}
