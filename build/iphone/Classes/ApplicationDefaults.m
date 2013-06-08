/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2013 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 * WARNING: This is generated code. Do not modify. Your changes *will* be lost.
 */

#import <Foundation/Foundation.h>
#import "TiUtils.h"
#import "ApplicationDefaults.h"

@implementation ApplicationDefaults

+ (NSMutableDictionary*) copyDefaults
{
	NSMutableDictionary * _property = [[NSMutableDictionary alloc] init];
	
	[_property setObject:[TiUtils stringValue:@"UIfy1QO8k5rSCOmjx7mSu9lOi3xSkPi3"] forKey:@"acs-oauth-secret-production"];
	[_property setObject:[TiUtils stringValue:@"IserlGtHs8rGO35tu6GVTWk2ocW6pSv7"] forKey:@"acs-oauth-key-production"];
	[_property setObject:[TiUtils stringValue:@"D9Ae5uJcLpuCiWs8uOHzCLuMCPyUAlS2"] forKey:@"acs-api-key-production"];
	[_property setObject:[TiUtils stringValue:@"avJp9QFlPU9YC4ioWeOrFvP4Oq5jOiD5"] forKey:@"acs-oauth-secret-development"];
	[_property setObject:[TiUtils stringValue:@"Y4iGLQNCL94aIrqvZ91XLJq9OcbxfM68"] forKey:@"acs-oauth-key-development"];
	[_property setObject:[TiUtils stringValue:@"X2pWQ1bDsXtxA77hc2bncfv4tJxmZo8l"] forKey:@"acs-api-key-development"];
	[_property setObject:[TiUtils stringValue:@"406983586022141"] forKey:@"ti.facebook.appid"];
	[_property setObject:[TiUtils stringValue:@"system"] forKey:@"ti.ui.defaultunit"];
	return _property;
}

@end