using Couchbase;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TodoApp.API.Models;

namespace TodoApp.API.Controllers
{
    
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        [Route("api/[controller]/addproject")]
        [HttpPost]
        public async Task<IActionResult> AddProject([FromBody] Projects_Add request)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");
            var bucket = await cluster.BucketAsync("todoapp");
            var scope = await bucket.ScopeAsync("lists");
            var collection = await scope.CollectionAsync("projects");

            var info = TimeZoneInfo.FindSystemTimeZoneById("Turkey Standard Time");
            DateTimeOffset localServerTime = DateTimeOffset.Now;
            DateTimeOffset localTime = TimeZoneInfo.ConvertTime(localServerTime, info);

            await collection.UpsertAsync(Guid.NewGuid().ToString(), new Projects_Add
            {
                userid = request.userid,
                name = request.name,
                status = request.status,
                createddate = localTime
            });

            return Ok();
        }

        [Route("api/[controller]/updateproject")]
        [HttpPost]
        public async Task<IActionResult> UpdateProject([FromBody] Projects_Update request)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");

            var result = await cluster.QueryAsync<dynamic>(
                "UPDATE todoapp.lists.projects t SET name=$name, status=$status Where meta(t).id=$id",
                options =>
                {
                    options.Parameter("name", request.name);
                    options.Parameter("status", request.status);
                    options.Parameter("id", request.id);
                }
            );

            return Ok(result);
        }

        [Route("api/[controller]/deleteproject")]
        [HttpPost]
        public async Task<IActionResult> DeleteProject([FromBody] Projects_Delete request)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");

            var result = cluster.QueryAsync<dynamic>(
                "DELETE FROM todoapp.lists.projects t Where meta(t).id=$id",
                options => options.Parameter("id", request.id)
            );

            return Ok();
        }

        [Route("api/[controller]/getprojects")]
        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");

            var result = await cluster.QueryAsync<dynamic>(
                "SELECT meta(t).id,t.* FROM todoapp.lists.projects t"
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
        [Route("api/[controller]/getprojects/{userid}")]
        [HttpGet]
        public async Task<IActionResult> GetProjects(string userid)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");

            var result = await cluster.QueryAsync<dynamic>(
                "SELECT meta(t).id,t.* FROM todoapp.lists.projects t Where t.userid=$userid",
                options => options.Parameter("userid", userid)
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

        [HttpGet]
        [Route("api/[controller]/getproject/{projectid}")]
        public async Task<IActionResult> GetProject(string projectid)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");

            var result = await cluster.QueryAsync<dynamic>(
                "SELECT meta(t).id, t.* FROM todoapp.lists.projects t",
                options => options.Parameter("id", projectid)
            );

            List<Projects> project = new List<Projects>();
            var count = 0;

            await foreach (var row in result)
            {
                
                if (row.id == projectid)
                {
                    count++;
                    project.Add(new Projects
                    {
                        id = row.id,
                        userid = row.userid,
                        name = row.name,
                        status = row.status,
                        createddate = row.createddate
                    });
                }
            }

            if (count == 0)
            {
                return NotFound();
            }
            else
            {
                return Ok(project);
            }
        }
    }
}
