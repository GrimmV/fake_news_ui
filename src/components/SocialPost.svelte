<script lang="ts">
    import { Card, CardContent, CardFooter, CardHeader } from "$lib/components/ui/card";
    import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar";
  
    export let content: string;
    export let username: string = "Dirk";
    export let avatar: string = "Dirk";
  </script>
  
  <Card class="w-full max-w-2xl transition-colors flex p-2">
    <CardHeader class="flex flex-row items-start space-y-0 p-4 pb-2">
      <div class="flex items-center gap-3">
        <Avatar class="h-10 w-10">
          <AvatarImage src={avatar} alt={username} />
          <AvatarFallback>{username.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <div class="font-semibold">{username}</div>
        </div>
      </div>
    </CardHeader>
  
    <CardContent class="px-4 py-2">
      <p class="text-sm sm:text-base">{content}</p>
    </CardContent>
  </Card>