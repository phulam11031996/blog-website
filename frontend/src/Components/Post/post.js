
import PostPage from "./PostPage";
import SideBar from '../Sidebar/sidebar';
import AppBar from '../AppBar/Appbar';
import Box from "@mui/material/Box";
// compile post list

export function postList (sort_filter=null, posts) {
	var postList = posts;
	// check if sort filter is specified, otherwise display all posts
	if(sort_filter === "popular") {
		// sort posts by votes
		postList = postList.sort((p1, p2) => {
			const upvote1 = p1['upVoteUsers'].length;
			const downvote1 = p1['downVoteUsers'].length;
			const upvote2 = p2['upVoteUsers'].length;
			const downvote2 = p2['downVoteUsers'].length;
			return (upvote2 - downvote2) - (upvote1 - downvote1);
		});
	} else if(sort_filter === "recent") {
		// sort posts by most recent publish date
		postList = postList.sort((p1, p2) => {
			const t1 = new Date(p1['createdAt']);
			const t2 = new Date(p2['createdAt']);
			return t2 - t1;
		});
	} else if(sort_filter === "trending") {
		// filter posts created in the last 30 days and sort by most votes
		postList = postList.filter((post) => {
			const time = new Date(post['createdAt']);
			var threshold = new Date();
			threshold.setDate(threshold.getDate() - 30);
			return time > threshold;
		}).sort((p1, p2) => {
			const upvote1 = p1['upVoteUsers'].length;
			const downvote1 = p1['downVoteUsers'].length;
			const upvote2 = p2['upVoteUsers'].length;
			const downvote2 = p2['downVoteUsers'].length;
			return (upvote2 - downvote2) - (upvote1 - downvote1);
		});
	}
	return render_postList(postList);
}

// render the given post list (standard, popular, recent, or trending)
function render_postList(posts) {
	const postList = posts.map((currentPost, index) => {
		return (
			<PostPage
				key={index}
				property = {currentPost}
			/>
		)
	});
	return (
		<Box>
			<div className="NavBar">
				<AppBar/>
			</div>
			<div className="SideBar">
				<SideBar/>
			</div>
			<Box sx={{ flexGrow: 1 }} style={{marginLeft: "10px", marginTop: "100px", marginRight: "10px", marginBottom: "30px"}}>
				<ul>
					{postList}
				</ul>
			</Box>
		</Box>
	)
}



