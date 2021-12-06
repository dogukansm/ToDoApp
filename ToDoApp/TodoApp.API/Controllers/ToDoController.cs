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
    public class ToDoController : ControllerBase
    {
        [HttpPost]
        [Route("api/[controller]/addtodo")]
        public async Task<IActionResult> AddToDo([FromBody] ToDo_Add request)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");
            var bucket = await cluster.BucketAsync("todoapp");
            var scope = await bucket.ScopeAsync("lists");
            var collection = await scope.CollectionAsync("todos");

            var info = TimeZoneInfo.FindSystemTimeZoneById("Turkey Standard Time");
            DateTimeOffset localServerTime = DateTimeOffset.Now;
            DateTimeOffset localTime = TimeZoneInfo.ConvertTime(localServerTime, info);

            await collection.UpsertAsync(Guid.NewGuid().ToString(), new ToDo_Add
            {
                projectid = request.projectid,
                name = request.name,
                description = request.description,
                status = request.status,
                createddate = localTime
            });
            
            return Ok();
        }

        [HttpGet]
        [Route("api/[controller]/gettodo")]
        public async Task<IActionResult> GetToDo()
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");

            var result = await cluster.QueryAsync<dynamic>(
                "SELECT meta(t).id,t.* FROM todoapp.lists.todos t"
            );

            List<ToDo> todo = new List<ToDo>();

            int count = 0;
            await foreach (var row in result)
            {
                count++;
                todo.Add(new ToDo
                {
                    id = row.id,
                    projectid = row.projectid,
                    name = row.name,
                    description = row.description,
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
                return Ok(todo);
            }
        }


        [HttpGet]
        [Route("api/[controller]/gettodo/{projectid}")]
        public async Task<IActionResult> GetToDo(string projectid)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");
            var result = await cluster.QueryAsync<dynamic>(
                "SELECT meta(t).id, t.* FROM todoapp.lists.todos t Where t.projectid=$projectid",
                options => options.Parameter("projectid", projectid)
            );

            List<ToDo> todo = new List<ToDo>();
            int count = 0;

            await foreach (var row in result)
            {
                count++;
                todo.Add(new ToDo()
                {
                    id = row.id,
                    projectid = row.projectid,
                    name = row.name,
                    description = row.description,
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
                return Ok(todo);
            }
        }

        [HttpPost]
        [Route("api/[controller]/updatetodo")]
        public async Task<IActionResult> UpdateToDo([FromBody] ToDo_Update request)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");
            var result = cluster.QueryAsync<dynamic>(
                "UPDATE todoapp.lists.todos t SET name=$name, description=$description, status=$status Where meta(t).id=$id",
                options =>
                {
                    options.Parameter("name", request.name);
                    options.Parameter("description", request.description);
                    options.Parameter("status", request.status);
                    options.Parameter("id", request.id);
                }
            );

            return Ok();
        }

        [HttpPost]
        [Route("api/[controller]/deletetodo")]
        public async Task<IActionResult> DeleteToDo([FromBody] ToDo_Delete request)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");
            var result = await cluster.QueryAsync<dynamic>(
                "DELETE FROM todoapp.lists.todos t Where meta(t).id=$id",
                options => options.Parameter("id", request.id)
            );

            return Ok();
        }
    }
}
