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
    public class RolesController : ControllerBase
    {
        [HttpPost]
        [Route("api/[controller]/addrole")]
        public async Task<IActionResult> AddRole([FromBody] Roles_Add request)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");
            var bucket = await cluster.BucketAsync("todoapp");
            var scope = await bucket.ScopeAsync("lists");
            var collection = await scope.CollectionAsync("roles");

            await collection.UpsertAsync(Guid.NewGuid().ToString(), new Roles_Add
            {
                title = request.title,
                isManager = request.isManager
            });

            return Ok();
        }

        [HttpPost]
        [Route("api/[controller]/updaterole")]
        public async Task<IActionResult> UpdateRole([FromBody] Roles_Update request)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");
            var result = await cluster.QueryAsync<dynamic>(
                "UPDATE todoapp.lists.roles t SET title=$title, isManager=$isManager Where meta(t).id=$id",
                options =>
                {
                    options.Parameter("title", request.title);
                    options.Parameter("isManager", request.isManager);
                    options.Parameter("id", request.id);
                }
            );

            return Ok();
        }

        [HttpPost]
        [Route("api/[controller]/deleterole")]
        public async Task<IActionResult> DeleteRole([FromBody] Roles_Delete request)
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");
            var result = await cluster.QueryAsync<dynamic>(
                "DELETE FROM todoapp.lists.roles t Where meta(t).id=$id",
                options => options.Parameter("id", request.id)
            );

            return Ok();
        }

        [HttpGet]
        [Route("api/[controller]/getroles")]
        public async Task<IActionResult> GetRoles()
        {
            var cluster = await Cluster.ConnectAsync("couchbase://localhost", "Administrator", "dogukansm");

            var result = await cluster.QueryAsync<dynamic>(
                "SELECT t.* FROM todoapp.lists.roles t"
            );

            List<Roles> roles = new List<Roles>();

            int count = 0;
            await foreach (var row in result)
            {
                count++;
                roles.Add(new Roles
                {
                    id = row.id,
                    title = row.title,
                    isManager = row.isManager
                });
            }

            if (count == 0)
            {
                return NotFound();
            }
            else
            {
                return Ok(roles);
            }
        }
    }
}
