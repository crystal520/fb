#import "ApplicationMods.h"

@implementation ApplicationMods

+ (NSArray*) compiledMods
{
	NSMutableArray *modules = [NSMutableArray array];
	[modules addObject:[NSDictionary dictionaryWithObjectsAndKeys:@"ti.cloud",@"name",@"ti.cloud",@"moduleid",@"2.3.0",@"version",@"1056b5d2-2bb5-4339-b930-297637aeec4e",@"guid",@"",@"licensekey",nil]];
	[modules addObject:[NSDictionary dictionaryWithObjectsAndKeys:@"google-analytics",@"name",@"analytics.google",@"moduleid",@"1.0",@"version",@"2dce4125-1f59-40f1-aeb9-3ed250b36dd9",@"guid",@"",@"licensekey",nil]];
	return modules;
}

@end