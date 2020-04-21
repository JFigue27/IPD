using ServiceStack;
using ServiceStack.Logging;

namespace Reusable.Rest.Implementations.SS
{
    //[Restrict(LocalhostOnly = true)]
    public class CacheService : Service,
        IGet<FlushAll>
    {

        public static ILog Log = LogManager.GetLogger("MyApp");

        public object Get(FlushAll request)
        {
            Cache.FlushAll();
            Log.Info($"Flush All Cache.");
            return new CommonResponse().Success();
        }
    }

    [Route("/Cache/FlushAll", "GET")]
    public class FlushAll
    {
    }
}
